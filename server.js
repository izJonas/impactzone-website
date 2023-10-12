// Function to get the nth key from the object
Object.prototype.getByIndex = function (index) {
    return this[Object.keys(this)[index]];
};

// Zum Verständnis: https://zellwk.com/blog/crud-express-mongodb/
console.log('May Node be with you')

// express Framework gets loaded first
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
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
            console.error(`Could not find file -> '${filename}'`);
            callback(err);
            return;
        }
        try {
            callback(false, JSON.parse(data));
        } catch (exception) {
            callback(exception);
        }
    });
}

let db;
let siteCollection;
let siteNavigationStructure;

//const connectionString = 'mongodb+srv://icrate-admin:test@cluster0.sjlt1ts.mongodb.net/?retryWrites=true&w=majority'
//const connectionString = 'mongodb+srv://iz-admin:g837upv5LPUpkmA@impactzonecluster.z5yncht.mongodb.net/?retryWrites=true&w=majority';
const connectionString = 'mongodb+srv://icrate-admin:test@cluster0.sjlt1ts.mongodb.net/?retryWrites=true&w=majority';

const SetViewEngine = function () {
    // Set the pug view engine
    //app.set('views', './views')
    app.set('views', [
        path.join(__dirname, '/source/views'),
        path.join(__dirname, '/source/views/sites'),
        path.join(__dirname, '/source/views/components'),
        path.join(__dirname, '/source/views/generators')
    ])

    app.set('view engine', 'pug');

    app.locals.basedir = path.join(__dirname, 'views');

    app.use(express.static(__dirname + '/public'));

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
        readJSONFile('./public/json/iz-web.json', function (err, json) {
            if (err) {
                console.error(`Could not read iz-web.json file... error -> '${err}'`);
                throw err;
            }
            siteNavigationStructure = json.sites.navigation;
            AfterMongoConnect(siteCollection)
        });
    })
    .catch(error => console.error(error));

const AfterMongoConnect = function (collectionToUse) {
    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(3000, function () {
        console.log('listening on 3000');
    });

    let landingPageName = Object.keys(siteNavigationStructure)[0];
    let landingPageTitle = siteNavigationStructure[`${landingPageName}`].label;
    console.log(`Landing-Page -> '${landingPageName}' | Title -> '${landingPageTitle}'`);
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
    /** This Route is the landing page! */
    // AddLinkedSite(landingPageName, landingPageTitle, true);
    /**Object.keys(siteNavigationStructure).forEach(
        key => {
            if (Object.keys(siteNavigationStructure[`${key}`]).includes("subsites")) {
                Object.keys(siteNavigationStructure[`${key}`].subsites).forEach(
                    subKey => AddLinkedSite(subKey, siteNavigationStructure[`${key}`].subsites[`${subKey}`].label, siteNavigationStructure[`${key}`].subsites[`${subKey}`].href));
            } else if (Object.keys(siteNavigationStructure[`${key}`]).includes("href")) {
                AddLinkedSite(key, siteNavigationStructure[`${key}`].label, siteNavigationStructure[`${key}`].href);
            }
        }
    );*/

    /** Now add all callable pages...or maybe not */

    app.post('/login', (req, res) => {
        collectionToUse.insertOne(req.body)
            .then(result => {
                console.log(result);
                res.redirect('/');
            })
            .catch(error => console.error(error));
    });
}

function AddLinkedSite(siteNameReference, siteNameTitle, landingPageHref) {
    console.log(`Trying to add Route: Ref -> '${siteNameReference}' | Title -> '${siteNameTitle}' | href -> '${landingPageHref == true ? '/' : landingPageHref}' ${landingPageHref == true ? '<- Landing Page' : ""}`);
    let requestPathMapping = landingPageHref;
    if (landingPageHref === true) {
        requestPathMapping = '/';
    }
    if (!siteNameTitle) {
        siteNameTitle = siteNameReference;
    }

    app.get(requestPathMapping, (req, res) => {

        // Load json collection
        let structuralSiteData;
        readJSONFile(`./public/json/sites/${siteNameReference}.json`, function (err, json) {
            if (err) { throw err; }
            structuralSiteData = json;
        });

        if (true) {
            res.render("main-content", { title: `impactzone - ${siteNameTitle}`, message: 'impactzone Design', siteNav: siteNavigationStructure, site: structuralSiteData, siteReference: siteNameReference });
        } else {
            db.collection('sites').find().toArray()
                .then(results => {
                    console.log(`Results for sites collection are -> '${results}'`);
                    res.render(siteNameReference, { title: `impactzone - ${siteNameTitle}`, message: 'impactzone Design', site: structuralSiteData, sitesContent: results });
                })
                .catch(error => console.error(error));
        }
    });
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
