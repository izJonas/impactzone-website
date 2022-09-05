// Zum Verständnis: https://zellwk.com/blog/crud-express-mongodb/
console.log('May Node be with you')

// express Framework gets loaded first
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

let db
let siteCollection

//const connectionString = 'mongodb+srv://icrate-admin:test@cluster0.sjlt1ts.mongodb.net/?retryWrites=true&w=majority'
const connectionString = 'mongodb+srv://iz-admin:g837upv5LPUpkmA@impactzonecluster.z5yncht.mongodb.net/?retryWrites=true&w=majority';

const SetViewEngine = function() {
    // Set the pug view engine
    //app.set('views', './views')
    app.set('views', [path.join(__dirname, '/views'),
        path.join(__dirname, '/views/sites'),
        path.join(__dirname, '/views/components'),
        path.join(__dirname, '/views/generators')
    ])

    app.set('view engine', 'pug')

    app.locals.basedir = path.join(__dirname, 'views')

    app.use(express.static(__dirname + '/public'))
}

SetViewEngine()

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        db = client.db('iz-web')
        siteCollection = db.collection('sites')
        AfterMongoConnect(siteCollection)
    })
    .catch(error => console.error(error))

const AfterMongoConnect = function(collectionToUse) {
    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }))

    app.listen(3000, function() {
        console.log('listening on 3000')
    })

    app.get('/', (req, res) => {

        // Load json collectionb
        const cursor = db.collection('sites').find().toArray()
            .then(results => {
                console.log(results)
                res.render('premiumFullService', { title: 'impactzone -Badass Design- by overpowered people!', message: 'impactzone Design', sitesContent: results })
            })
            .catch(error => console.error(error))

    })

    app.post('/login', (req, res) => {
        collectionToUse.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.redirect('/')
            })
            .catch(error => console.error(error))
    })
}