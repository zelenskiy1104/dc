var app = angular.module('clientApp', []);

app.controller('RootController', function(socket) {
    this.auth = false;
    this.userdata = {};

    socket.on('connected', (data) => {
        socket.id = data.socketid;
    });

    this.increaseBalance = function () {
        socket.emit('change balance', {
            sum: 100
        });
    };

    socket.on('balance updated', (data) => {
        if (data.status === 'ok') {
            this.userdata.balance = data.balance;
        }
    });
});