const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drone-cafe';

exports.changeStatus = function(status, id, done) {
    callChangeStatus(status, id, (err, result) => {
        done(result);
    });
}

function callChangeStatus(status, id, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            console.log('Проблема с соединением с базой данных: ', err);
            return;
        }

        let collection = db.collection('orders');

        collection.aggregate([
            {
                $match: {_id: new mongodb.ObjectId(id)}
            },
            {
                $lookup :
                    {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_record"
                    }
            },
            {
                $lookup :
                    {
                        from: "menu",
                        localField: "menu_id",
                        foreignField: "id",
                        as: "menu_record"
                    }
            }
        ]).get((err, result) => {
            if (err) {
                console.log('Проблема с соединением с базой данных: ', err);
                return;
            }

            let order = result[0];
            let socketid = order.user_record[0].socketid;
            let orderid = order._id;
            let email = order.user_record[0].email;
            let price = order.menu_record[0].price;

            let cookingStartDate = order.cooking_start_date;
            if (status == 'cooking') {
                cookingStartDate = new Date();
            }

            let cookingFinishDate = false;
            if (status == 'ready' || status == 'troubles') {
                cookingFinishDate = new Date();
            }

            collection.updateOne({_id: new mongodb.ObjectId(id)}, {$set: {status: status, cooking_start_date: cookingStartDate, cooking_finish_date: cookingFinishDate}}, (err, result) => {
                if (err) {
                    console.log('Проблема с соединением с базой данных: ', err);
                    console.log(err);
                }

                db.close();

                callback(err, {result: result, socketid: socketid, orderid: orderid, email: email, price: price});
            });
        });

    });
}

exports.dropOrder = function(id, email, done) {
    callDropOrder(id, email, (err, result) => {
        done(result);
    });
}

function callDropOrder(id, email, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            console.log('Проблема с соединением с базой данных: ', err);
            return;
        }

        let users = db.collection('users');

        users.find({email: email}).toArray((err, result) => {
            if (err) {
                console.log('Проблема с соединением с базой данных: ', err);
                return;
            }

            if (result.length > 0) {
                var socketid = result[0].socketid;

                let orders = db.collection('orders');

                orders.removeOne({_id: new mongodb.ObjectID(id)}, function(err, result) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }

                    db.close();

                    callback(err, {status: result.result.ok, socketid: socketid});
                });
            }
        });
    });
}

exports.kitchenList = function(status, done) {
    callKitchenList(status, (err, result) => {
        done(result);
    });
}

function callKitchenList(status, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            console.log('Проблема с соединением с базой данных: ', err);
            return;
        }

        let collection = db.collection('orders');

        collection.aggregate([
            {
                $match: {status: status}
            },
            {
                $lookup :
                    {
                        from: "menu",
                        localField: "menu_id",
                        foreignField: "id",
                        as: "menu_item"
                    }
            }
        ]).get((err, result) => {
            if (err) {
                console.log('Проблема с соединением с базой данных: ', err);
                return;
            }

            db.close();

            callback(err, result);
        });

    });
}

exports.list = function(user_id, done) {
    callList(user_id, (err, result) => {
        done(result);
    });
}

function callList(user_id, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            console.log('Проблема с соединением с базой данных: ', err);
            return;
        }

        let collection = db.collection('orders');

        collection.aggregate([
            {
                $match: {user_id: user_id}
            },
            {
                $lookup :
                {
                    from: "menu",
                    localField: "menu_id",
                    foreignField: "id",
                    as: "menu_item"
                }
            }
        ]).get((err, result) => {
            if (err) {
                console.log('Проблема с соединением с базой данных: ', err);
                return;
            }

            db.close();

            callback(err, result);
        });

    });
}

exports.create = function(menu, user_id, done) {
    callCreate(menu, user_id, (err, result) => {
        done(result);
    });
}

function callCreate(menu, user_id, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            console.log('Проблема с соединением с базой данных: ', err);
            return;
        }

        let collection = db.collection('orders');

        let order = {
            user_id: user_id,
            menu_id: menu.id,
            status: 'order',
            order_start_date: new Date(),
            cooking_start_date: false,
        };
        
        collection.insertOne(order, (err, result) => {
            if (err) {
                console.log('Проблема с соединением с базой данных: ', err);
                console.log(err);
            }

            db.close();
            callback(err, {status: 'ok', price: menu.price});
        });
    });
}