// Zum Verständnis: https://zellwk.com/blog/crud-express-mongodb/
console.log('May Node be with you')

// express Framework gets loaded first
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
const fs = require('fs');
const minify = require('express-minify');
app.use(minify({
    cache: __dirname + '/cache',
    uglifyJsModule: null,
    errorHandler: null,
    jsMatch: /javascript/,
    cssMatch: /css/,
    jsonMatch: /json/,
    sassMatch: /css/,
    lessMatch: /less/,
    stylusMatch: /stylus/,
    coffeeScriptMatch: /coffeescript/,
}));

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        try {
            callback(null, JSON.parse(data));
        } catch (exception) {
            callback(exception);
        }
    });
}

let db
let siteCollection

//const connectionString = 'mongodb+srv://icrate-admin:test@cluster0.sjlt1ts.mongodb.net/?retryWrites=true&w=majority'
const connectionString = 'mongodb+srv://iz-admin:g837upv5LPUpkmA@impactzonecluster.z5yncht.mongodb.net/?retryWrites=true&w=majority';

const SetViewEngine = function () {
    // Set the pug view engine
    //app.set('views', './views')
    app.set('views', [
        path.join(__dirname, '/source/views'),
        path.join(__dirname, '/source/views/sites'),
        path.join(__dirname, '/source/views/components'),
        path.join(__dirname, '/source/views/generators')
    ])

    app.set('view engine', 'pug')

    app.locals.basedir = path.join(__dirname, 'views')

    app.use(express.static(__dirname + '/public'))

    app.use('/assets', [
        express.static(__dirname + '/node_modules/jquery/dist/')
    ])

}

ClearCache();

SetViewEngine()

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        db = client.db('iz-web')
        siteCollection = db.collection('sites')
        AfterMongoConnect(siteCollection)
    })
    .catch(error => console.error(error))

const AfterMongoConnect = function (collectionToUse) {
    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }))

    app.listen(3000, function () {
        console.log('listening on 3000')
    })

    app.get('/', (req, res) => {

        // Load json collectionb
        let premiumFullServiceData;
        readJSONFile('./public/json/sites/premiumFullService.json', function (err, json) {
            if (err) { throw err; }
            premiumFullServiceData = json
        });

        const cursor = db.collection('sites').find().toArray()
            .then(results => {
                console.log(results)
                res.render('premiumFullService', { title: 'impactzone -Badass Design- by overpowered people!', message: 'impactzone Design', site: premiumFullServiceData, sitesContent: results })
            })
            .catch(error => console.error(error))

    })

    app.get('/tiko', (req, res) => {

        // Load json collection
        let tikoOfficeData;
        readJSONFile('./public/json/sites/tikoOffice.json', function (err, json) {
            if (err) { throw err; }
            tikoOfficeData = json
        });

        const cursor = db.collection('sites').find().toArray()
            .then(results => {
                console.log(results)
                res.render('tikoOffice', { title: 'TIKO Office | T.I.K.O. OFFICE e.K. ', message: 'TIKO Office', site: tikoOfficeData, sitesContent: results })
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
function ClearCache() {
    const directory = 'cache';

    fs.readdir(directory, (err, files) => {
        if (err)
            throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err)
                    throw err;
            });
        }
    });
}
