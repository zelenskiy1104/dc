const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drone-cafe';

const Error = require('../classes/Error');

/*
 * Получить список с меню
 */

exports.list = function(done) {
    callList((err, result) => {
        done(result);
    });
}

function callList(callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
            return;
        }

        let collection = db.collection('menu');

        collection.find({}).toArray((err, result) => {
            if (err) {
                let e = new Error(err, 'db');
                e.log();
                return;
            }

            db.close();
            callback(err, result);
        });
    });
}

