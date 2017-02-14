var app = angular.module('clientApp', []);

app.controller('RootController', function(socket) {
    this.auth = false;
    this.userdata = {};

    // Когда полдключились к сокету, сохраняем id
    socket.on('connected', (data) => {
        socket.id = data.socketid;
    });

    // Увеличить баланс
    this.increaseBalance = function () {
        socket.emit('change balance', {
            sum: 100
        });
    };

    // Когда баланс увеличен
    socket.on('balance updated', (data) => {
        if (data.status === 'ok') {
            this.userdata.balance = data.balance;
        }
    });
});