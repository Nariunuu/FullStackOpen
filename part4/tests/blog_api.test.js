const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token
let testUser

before(async () => {
  await mongoose.connection.asPromise()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  testUser = await new User({ username: 'tester', name: 'Tester', passwordHash }).save()

  const login = await api
    .post('/api/login')
    .send({ username: 'tester', password: 'secret' })
  token = login.body.token

  await Blog.insertMany(
    helper.initialBlogs.map((b) => ({ ...b, user: testUser._id }))
  )
})

describe('GET /api/blogs', () => {
  test('returns blogs as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have an id property (not _id)', async () => {
    const response = await api.get('/api/blogs')
    for (const blog of response.body) {
      assert.ok(blog.id, 'blog should have an id property')
      assert.strictEqual(blog._id, undefined)
    }
  })
})

describe('POST /api/blogs', () => {
  test('creates a new blog with a valid token', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    assert.ok(blogs.map((b) => b.title).includes('Type wars'))
  })

  test('responds with 401 when token is missing', async () => {
    const newBlog = {
      title: 'No token',
      author: 'Anon',
      url: 'http://example.com/no-token',
      likes: 0,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })

  test('defaults likes to 0 when missing', async () => {
    const newBlog = {
      title: 'No likes blog',
      author: 'Anon',
      url: 'http://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('responds with 400 when title is missing', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ author: 'Anon', url: 'http://example.com/no-title' })
      .expect(400)
  })

  test('responds with 400 when url is missing', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No url', author: 'Anon' })
      .expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('removes a blog owned by the user and returns 204', async () => {
    const before = await helper.blogsInDb()
    const target = before[0]

    await api
      .delete(`/api/blogs/${target.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const after = await helper.blogsInDb()
    assert.strictEqual(after.length, before.length - 1)
    assert.ok(!after.map((b) => b.id).includes(target.id))
  })

  test('responds with 403 when a different user attempts deletion', async () => {
    const passwordHash = await bcrypt.hash('secret', 10)
    await new User({ username: 'intruder', passwordHash }).save()
    const login = await api
      .post('/api/login')
      .send({ username: 'intruder', password: 'secret' })

    const blogs = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(403)
  })

  test('responds with 401 when token is missing', async () => {
    const blogs = await helper.blogsInDb()
    await api.delete(`/api/blogs/${blogs[0].id}`).expect(401)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates the likes count', async () => {
    const before = await helper.blogsInDb()
    const target = before[0]

    const response = await api
      .put(`/api/blogs/${target.id}`)
      .send({ likes: target.likes + 10 })
      .expect(200)

    assert.strictEqual(response.body.likes, target.likes + 10)
  })

  test('responds with 404 for a non-existing id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    await api.put(`/api/blogs/${fakeId}`).send({ likes: 1 }).expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
