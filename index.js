const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const drone = require('netology-fake-drone-api');

const menuparser = require('./menuparser');
menuparser.parseMenu();

mainDir = __dirname;

const Menu = require(mainDir+'/models/menu');
const User = require(mainDir+'/models/user');
const Order = require(mainDir+'/models/order');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile('./public/client.html', { root: __dirname });
});

app.get('/kitchen', function(req, res){
    res.sendFile('public/kitchen.html', { root: __dirname });
});

server.listen(port, function() {
    console.log('Listening on port '+port);
});

io.on('connection', function (socket) {

    socket.emit('connected', {socketid: socket.id});

    socket.on('do auth', function (data) {
        var name = data.name;
        var email = data.email;
        var socketid = data.socketid;

        User.auth(name, email, socketid, function(data) {
            socket.emit('authorized', data);

            socket.userdata = data.object;
        });
    });

    socket.on('change balance', function (data) {
        var sum = data.sum;

        User.changeBalance(socket.userdata.email, sum, function(data) {
            socket.userdata.balance = data.balance;

            socket.emit('balance updated', data);
        });
    });

    socket.on('get menu', function () {
        Menu.list(function(collection) {
            socket.emit('menu', collection);
        });
    });

    socket.on('get orders', function () {
        Order.list(socket.userdata._id, function(collection) {
            socket.emit('orders list', collection);
        });
    });

    socket.on('add to order', function (data) {
        Order.create(data.menu, socket.userdata._id, function(data) {
            if (data.status == 'ok') {
                socket.emit('order updated');
                socket.broadcast.emit('order lists updated');

                User.changeBalance(socket.userdata.email, -data.price, function(data) {
                    socket.userdata.balance = data.balance;

                    socket.emit('balance updated', data);
                });
            }
        });
    });

    socket.on('cancel order', function (data) {
        if (data.order.status == 'order') {
            Order.dropOrder(data.order._id, socket.userdata.email, (result) => {
                if (result.status == 1) {

                    let menu = data.order.menu_item[0];
                    User.changeBalance(socket.userdata.email, menu.price, function(data) {
                        socket.userdata.balance = data.balance;

                        socket.emit('balance updated', data);
                    });

                    socket.emit('order updated');
                    socket.broadcast.emit('order lists updated');
                }
            });
        }
    });

    socket.on('troubles resolution', function (data) {
        Order.dropOrder(data.order._id, socket.userdata.email, (result) => {
            if (result.status == 1) {
                socket.emit('order updated');
            }
        });

        if (data.resolution == 'yes') {
            let menu = data.order.menu_item[0];
            menu.price = menu.price * 0.95;
            Order.create(menu, socket.userdata._id, function(data) {
                if (data.status == 'ok') {
                    socket.emit('order updated');
                    socket.broadcast.emit('order lists updated');

                    User.changeBalance(socket.userdata.email, -data.price, function(data) {
                        socket.userdata.balance = data.balance;

                        socket.emit('balance updated', data);
                    });
                }
            });
        }
    });

    socket.on('get kitchen orders', function (data) {
        Order.kitchenList(data.status, function(collection) {
            if (data.status == 'order') {
                socket.emit('kitchen orders list', collection);
            }
            if (data.status == 'cooking') {
                socket.emit('kitchen cooking list', collection);
            }
        });
    });

    socket.on('start cooking', function (data) {
        Order.changeStatus('cooking', data.id, function(result) {
            let res = result.result.result.nModified;
            if (res == 1) {
                socket.emit('order lists updated');
                socket.to(result.socketid).emit('order updated');
            }
        });
    });

    socket.on('start delievery', function (data) {
        Order.changeStatus('delievery', data.id, function(result) {
            let res = result.result.result.nModified;
            if (res == 1) {
                socket.emit('order lists updated');
                socket.to(result.socketid).emit('order updated');

                drone
                    .deliver()
                    .then(() => {
                        console.log('Доставлено');
                        Order.changeStatus('ready', data.id, function(result) {
                            socket.to(result.socketid).emit('order updated');
                            dropOrder(result.orderid, result.email);
                        });
                    })

                    .catch(() => {
                        console.log('Возникли сложности');
                        Order.changeStatus('troubles', data.id, function(result) {
                            socket.to(result.socketid).emit('order updated');

                            User.changeBalance(result.email, result.price, function(data) {
                                socket.to(result.socketid).emit('balance updated', data);
                            });

                            dropOrder(result.orderid, result.email);
                        });
                    });

                function dropOrder(id, email) {
                    setTimeout(() => {
                        Order.dropOrder(id, email, (result) => {
                            if (result.status == 1) {
                                socket.to(result.socketid).emit('order updated');
                            }
                        });
                    }, 120000);
                };
            }
        });
    });
    
});