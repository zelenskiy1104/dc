const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drone-cafe';

const Error = require('../classes/Error');

/*
 * Изменить статус заказа
 *
 * @param status Новый статус
 * @param id Идентификатор заказа
 * @param done callback
 */

exports.changeStatus = function(status, id, done) {
    callChangeStatus(status, id, (err, result) => {
        done(result);
    });
}

function callChangeStatus(status, id, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
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
                let e = new Error(err, 'db');
                e.log();
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

            let orderFinishDate = false;
            if (status == 'ready' || status == 'troubles') {
                orderFinishDate = new Date();
            }

            collection.updateOne({_id: new mongodb.ObjectId(id)}, {$set: {status: status, cooking_start_date: cookingStartDate, order_finish_date: orderFinishDate}}, (err, result) => {
                if (err) {
                    let e = new Error(err, 'db');
                    e.log();
                    return;
                }

                db.close();

                callback(err, {result: result, socketid: socketid, orderid: orderid, email: email, price: price});
            });
        });

    });
}

/*
 * Удалить заказ
 *
 * @param id Идентификатор заказа
 * @param email Email пользователя
 * @param done callback
 */

exports.dropOrder = function(id, email, done) {
    callDropOrder(id, email, (err, result) => {
        done(result);
    });
}

function callDropOrder(id, email, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
            return;
        }

        let users = db.collection('users');

        users.find({email: email}).toArray((err, result) => {
            if (err) {
                let e = new Error(err, 'db');
                e.log();
                return;
            }

            if (result.length > 0) {
                var socketid = result[0].socketid;

                let orders = db.collection('orders');

                orders.removeOne({_id: new mongodb.ObjectID(id)}, function(err, result) {
                    if (err) {
                        let e = new Error(err, 'db');
                        e.log();
                        return;
                    }

                    db.close();

                    callback(err, {status: result.result.ok, socketid: socketid});
                });
            }
        });
    });
}

/*
 * Получение списка заказов для интерфейса кухни
 *
 * @param status Статус заказов для запроса
 * @param done callback
 */

exports.kitchenList = function(status, done) {
    callKitchenList(status, (err, result) => {
        done(result);
    });
}

function callKitchenList(status, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
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
                },
            },
            {
                $project: {
                    currentDate: { $add: [new Date()] },
                    menu_item: 1,
                    user_id: 1,
                    menu_id: 1,
                    status: 1,
                    order_start_date: 1,
                    cooking_start_date: 1,
                    order_finish_date: 1,
                }
            },
        ]).get((err, result) => {
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

/*
 * Получение списка заказов для интерфейса клиента
 *
 * @param user_id Идентификатор пользователя
 * @param done callback
 */

exports.list = function(user_id, done) {
    callList(user_id, (err, result) => {
        done(result);
    });
}

function callList(user_id, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
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
            },
            {
                $project: {
                    currentDate: { $add: [new Date()] },
                    menu_item: 1,
                    user_id: 1,
                    menu_id: 1,
                    status: 1,
                    order_start_date: 1,
                    cooking_start_date: 1,
                    order_finish_date: 1,
                }
            },

        ]).get((err, result) => {
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

/*
 * Создать заказ
 *
 * @param menu Объект menu
 * @param user_id Идентификатор пользователя
 * @param done callback
 */

exports.create = function(menu, user_id, done) {
    callCreate(menu, user_id, (err, result) => {
        done(result);
    });
}

function callCreate(menu, user_id, callback) {
    MongoClient.connect(URI, (err, db) => {
        if (err) {
            let e = new Error(err, 'connect');
            e.log();
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
                let e = new Error(err, 'db');
                e.log();
                return;
            }

            db.close();
            callback(err, {status: 'ok', price: menu.price});
        });
    });
}