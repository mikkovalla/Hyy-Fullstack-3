const mongoose = require('mongoose')
const Schema = mongoose.Schema
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URL

mongoose.connect(url)

/*thanks to stackoverflow again...
const toJson = {
  transform: (document, {
    _id,
    __v,
    ...rest
  }) => ({
    id: _id,
    ...rest
  })
}*/

const personSchema = new Schema({
  name: String,
  number: String
} /*, { toJson }*/ )

const Person = mongoose.model('Person', personSchema)

module.exports = {
  Person
}