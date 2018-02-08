const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan('tiny'))

let persons = [{
    "name": "Arto Hellas",
    "number": "55 8999222",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  },
  {
    "name": "Mikko kikko",
    "number": "040-5558",
    "id": 5
  }
]

morgan.token('type', function (req, res) {
  return req.headers['content-type']
})

app.get('/', (req, res) => {
  res.send('<h1>puhelinluettelo</h1>')
  morgan.token()
})

app.get('/info', (req, res) => {
  res.send('<p>puhelinluettelossa on ' + persons.length + ' henkilön tiedot</p>')
})

app.get('/api/persons', (req, res) => {
  res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
    morgan.token()
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

const uusiId = () => {
  const uusinId = Math.floor(Math.random() * 100) + persons.length
  return uusinId
}

app.post('/api/persons', (req, res) => {

  const person = req.body
  console.log(person)
  console.log(uusiId())

  if (person.name === undefined) {
    return res.status(400).json({
      error: 'Henkilöllä pitää olla nimi'
    })
  }
  if (person.number === undefined) {
    return res.status(400).json({
      error: 'puhelin numero puuttuu'
    })
  }
  const uusiNimi = person.name.toUpperCase()

  const onkoOlemassa = persons.find(p => p.name.toUpperCase() === uusiNimi)
  console.log(onkoOlemassa)

  if (onkoOlemassa) {
    return res.status(400).json({
      error: 'Henkilöllä on jo numero'
    })
  }

  const hlo = {
    name: person.name,
    number: person.number,
    id: uusiId()
  }

  persons = persons.concat(hlo)
  console.log(hlo)
  res.json(hlo)
  morgan.token()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})