const express = require('express')
const logger = require('./logger')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(logger)
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.static('dist'))

app.get('/api/persons', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
})

app.get('/info', async (req, res) => {
  const count = await Person.countDocuments({})
  res.send(
    `<p>Phonebook has info for ${count} people</p>
     <p>${new Date()}</p>`
  )
})

app.get('/api/persons/:id', async (req, res) => {
  const person = await Person.findById(req.params.id)
  if (!person) {
    return res.status(404).end()
  }
  res.json(person)
})

app.delete('/api/persons/:id', async (req, res) => {
  await Person.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

app.put('/api/persons/:id', async (req, res) => {
  const { number } = req.body
  const updated = await Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
  if (!updated) {
    return res.status(404).end()
  }
  res.json(updated)
})

app.post('/api/persons', async (req, res) => {
  const { name, number } = req.body

  const existing = await Person.findOne({ name })
  if (existing) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const saved = await new Person({ name, number }).save()
  res.status(201).json(saved)
})

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
