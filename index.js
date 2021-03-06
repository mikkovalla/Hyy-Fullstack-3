const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const {
  Person
} = require('./models/person')


app.use(bodyParser.json())
//app.use(morgan('tiny'))
//alla morgan loggerin kustomoitu logger joka palauttaa logissa myös pyynnön rungon
app.use(morgan(
  ':method :url :req-body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

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

//mongoose helpperi funktio
const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

// morgan kustomoitu lisä loggaukseen
morgan.token('req-body', function (req, res) {
  return (JSON.stringify(req.body))
})

app.get('/', (req, res) => {
  res.send('<h1>puhelinluettelo</h1>')
})

app.get('/info', (req, res) => {
  Person
  .find({})
  .then(r =>{
    return res.send('<p>puhelinluettelossa on ' + r.length + ' henkilön tiedot</p>')
  })
  
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(pe => {
      res.json(pe.map(formatPerson))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(pe => {
      if (pe) {
        res.json(formatPerson(pe))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      res.status(404).send({
        error: 'malformatted id'
      })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(404).send({
        error: 'malformatted id'
      })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, {
      number: body.number
    })
    .then(paivitetty => {
      res.json(formatPerson(paivitetty))
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({
        error: 'malformatted id'
      })
    })
})

app.post('/api/persons', (req, res) => {

  const person = req.body
  //console.log(person)
  //console.log(uusiId())

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
  //console.log(onkoOlemassa)

  if (onkoOlemassa) {
    return res.status(400).json({
      error: 'Henkilöllä on jo numero!'
    })
  }

  const hlo = new Person({
    name: person.name,
    number: person.number
  })

  Person
    .find({
      name: person.name
    })
    .then(result => {
      console.log('result', result)
      if (result.length === 0) {
        return hlo
          .save()
          .then(response => {
            console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
            res.json(hlo)
          })
      } else {
        return res.status(404).send({
          error: 'henkilö on jo puhelin luettelossa'
        })
      }
    })

  //vanhan tehtävän koodi jätetty kummittelemaan...
  /*hlo
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
      res.json(hlo)
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({
        error: 'henkilö on jo puhelin luettelossa'
      })
    })*/
})

//port fix for heroku
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})