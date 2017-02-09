const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/drone-cafe';

exports.list = function(done) {
    callList((err, result) => {
        done(result);
    });
}

function callList(callback) {
    MongoClient.connect(url, (err, db) => {
        if (err) {
            console.log('Проблема с соединением с базой данных: ', err);
            return;
        }

        let collection = db.collection('menu');

        collection.find({}).toArray((err, result) => {
            if (err) {
                console.log('Проблема с соединением с базой данных: ', err);
                return;
            }

            db.close();
            callback(err, result);
        });
    });
}

