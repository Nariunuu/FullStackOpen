const mongoose = require('mongoose')

const url = process.env.MONGO_URI
if (!url) {
  console.error('MONGO_URI is not set')
  process.exit(1)
}

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const run = async () => {
  await mongoose.connect(url, { family: 4 })

  const [, , name, number] = process.argv

  if (name && number) {
    await new Person({ name, number }).save()
    console.log(`added ${name} number ${number} to phonebook`)
  } else {
    const persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach(p => console.log(`${p.name} ${p.number}`))
  }

  await mongoose.connection.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
