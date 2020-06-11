require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

// INITIALIZATION APP
const app = express()

// DB
MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database 🦕')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        // 
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.use(express.static('public'))
        // ROUTES
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
        })
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => res.redirect('/'))
                .catch(err => console.error(err))
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {$set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
                },
                {
                    upsert: true
                }
            )
                .then(result => res.json('Success'))
                .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: 'Darth Vadar' }
            )
            .then(result => {
                if(result.deleteOne === 0){
                    return res.json('No quote to delete')
                }
                res.json(`Deleted Darth Vadar's quote`)
            })
            .catch(error => console.error(error))
        })
        // SERVER
        app.listen(3000, () => console.log('Run Server 🐢'))
    })
    .catch(error => console.error(error))