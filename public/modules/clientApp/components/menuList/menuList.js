function MenuListController(socket) {

    var ctrl = this;

    ctrl.$onInit = function() {
        socket.emit('get menu');
    }

    socket.on('menu', (data) => {
        this.list = data;
    });
}

angular.module('clientApp').component('menuList', {
    templateUrl: 'modules/clientApp/components/menuList/menuList.html',
    controller: MenuListController,
    bindings: {
        balance: '<'
    }
});