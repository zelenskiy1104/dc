const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drone-cafe';

const Error = require('./classes/Error');

let menuJson = require('./menu.json');

exports.parseMenu = function() {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
            return;
        }

        let collection = db.collection('menu');

        collection.drop((err, result) => {
            if (err) {
                let e = new Error(err, 'db');
                e.log();
                return;
            }

            collection.insert(menuJson, (err, result) => {
                if (err) {
                    let e = new Error(err, 'db');
                    e.log();
                    return;
                }

                db.close();
                console.log('menu parsed!');
            });
        });


    });
}

