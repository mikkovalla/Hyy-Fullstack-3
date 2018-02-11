require('dotenv').config()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = process.env.MONGODB_URL

mongoose.connect(url)

const personSchema = new Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person