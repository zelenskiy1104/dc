function AuthController(socket) {
    var ctrl = this;

    ctrl.name = '';
    ctrl.email = '';

    this.doAuth = function() {
        socket.emit('do auth', {
            name: this.name,
            email: this.email,
            socketid: socket.id,
        });
    }

    ctrl.authorized = false;

    socket.on('authorized', (data) => {
        if (data.status === 'ok') {
            ctrl.authorized = true;

            this.onStatusChange({$event: {status: ctrl.authorized}});
            this.hasUserData({$event: {userdata: data.object}})
        }
    });
}

angular.module('clientApp').component('auth', {
    templateUrl: 'modules/clientApp/components/auth/auth.html',
    controller: AuthController,
    bindings: {
        onStatusChange: '&',
        hasUserData: '&'
    }
});