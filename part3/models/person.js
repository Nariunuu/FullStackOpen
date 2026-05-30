const mongoose = require('mongoose')

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.error('error connecting to MongoDB:', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v),
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
