const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drone-cafe';

const Error = require('../classes/Error');

/*
 * Авторизация клиента
 * */

exports.auth = function(name, email, socketid, done) {
    callAuth(name, email, socketid, (err, result) => {
        done(result);
    });
}

function callAuth(name, email, socketid, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
            return;
        }

        let collection = db.collection('users');

        collection.find({email: email}).toArray((err, result) => {
            if (err) {
                let e = new Error(err, 'db');
                e.log();
                return;
            }

            if (result.length == 0) {
                collection.insertOne({name: name, email: email, balance: 100, socketid: socketid}, (err, result) => {
                    if (err) {
                        let e = new Error(err, 'db');
                        e.log();
                        return;
                    }

                    db.close();
                    callback(err, {status: 'ok', object: result.ops[0]});
                });
            }
            else {
                var founded = result[0];
                collection.updateOne({email: email}, {$set: {name: name, socketid: socketid}}, (err, result) => {
                    if (err) {
                        let e = new Error(err, 'db');
                        e.log();
                        return;
                    }

                    db.close();
                    var object = {
                        _id: founded._id,
                        name: name,
                        email: email,
                        balance: founded.balance
                    };
                    callback(err, {status: 'ok', object: object});
                });
            }
        });
    });
}

/*
 * Функция для изменения баланса клиента
 * */

exports.changeBalance = function(email, sum, done) {
    callChangeBalance(email, sum, (err, result) => {
        done(result);
    });
}

function callChangeBalance(email, sum, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
            return;
        }

        let collection = db.collection('users');

        collection.find({email: email}).toArray((err, result) => {
            if (err) {
                let e = new Error(err, 'db');
                e.log();
                return;
            }

            if (result.length > 0) {
                var founded = result[0];
                collection.updateOne({email: email}, {$set: {balance: founded.balance + sum}}, (err, result) => {
                    if (err) {
                        let e = new Error(err, 'db');
                        e.log();
                        return;
                    }

                    db.close();

                    callback(err, {status: 'ok', balance: founded.balance + sum});
                });
            }
        });


    });
}

