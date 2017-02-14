function MenuListController(socket) {

    var ctrl = this;

    // Запрашиваем меню
    ctrl.$onInit = function() {
        socket.emit('get menu');
    }

    // Пришел ответ с меню
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