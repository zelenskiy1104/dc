const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/drone-cafe';

let menuJson = require('./menu.json');

exports.parseMenu = function() {
    MongoClient.connect(url, (err, db) => {
        if (err) {
            console.log('Проблема с соединением с базой данных: ', err);
            return;
        }

        let collection = db.collection('menu');

        collection.drop((err, result) => {
            if (err) {
                console.log(err);
            }

            collection.insert(menuJson, (err, result) => {
                if (err) {
                    console.log(err);
                }

                db.close();
                console.log('menu parsed!');
            });
        });


    });
}

