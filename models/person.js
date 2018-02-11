require('dotenv').config()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = process.env.MONGODB_URL

mongoose.connect(url)

//thanks to stackoverflow again...
const toJson = {
  transform: (document, {
    _id,
    __v,
    ...rest
  }) => ({
    id: _id,
    ...rest
  })
}

const personSchema = new Schema({
  name: String,
  number: String
}, { toJson })

const Person = mongoose.model('Person', personSchema)

module.exports = {
  Person
}