const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

before(async () => {
  await mongoose.connection.asPromise()
})

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('rootpass', 10)
  await new User({ username: 'root', name: 'Root', passwordHash }).save()
})

describe('POST /api/users', () => {
  test('creates a new user with valid input', async () => {
    const before = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send({ username: 'alice', name: 'Alice', password: 'wonderland' })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, 'alice')
    assert.strictEqual(response.body.passwordHash, undefined)

    const after = await helper.usersInDb()
    assert.strictEqual(after.length, before.length + 1)
  })

  test('responds with 400 when username is too short', async () => {
    await api
      .post('/api/users')
      .send({ username: 'al', password: 'wonderland' })
      .expect(400)
  })

  test('responds with 400 when password is too short', async () => {
    await api
      .post('/api/users')
      .send({ username: 'alice', password: 'wo' })
      .expect(400)
  })

  test('responds with 400 when username is missing', async () => {
    await api.post('/api/users').send({ password: 'wonderland' }).expect(400)
  })

  test('responds with 400 when username already exists', async () => {
    await api
      .post('/api/users')
      .send({ username: 'root', password: 'wonderland' })
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
