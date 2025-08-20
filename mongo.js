require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/Person')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI.replace('<password>', password)

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    if (name && number) {
      const person = new Person({ name, number })
      return person.save().then(() => {
        console.log(`Added ${name} (${number}) to phonebook`)
        mongoose.connection.close()
      })
    } else {
      return Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
    }
  })
  .catch(err => {
    console.error(err)
    mongoose.connection.close()
  })
