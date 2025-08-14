const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [phone]')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url = `mongodb+srv://chuckvlix:${password}@cluster0.yynhgtf.mongodb.net/DBphonebook?retryWrites=true&w=majority&appName=DBphonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    if (name && phone) {
      const person = new Person({ name, phone })
      return person.save().then(() => {
        console.log(`Added ${name} (${phone}) to phonebook`)
        mongoose.connection.close()
      })
    } else {
      return Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.phone}`)
        })
        mongoose.connection.close()
      })
    }
  })
  .catch(err => {
    console.error(err)
    mongoose.connection.close()
  })

const personSchema = new mongoose.Schema({
  name: String,
  phone: String
})

const Person = mongoose.model('Person', personSchema)
