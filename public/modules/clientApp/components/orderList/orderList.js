function OrderListController(socket) {
    var ctrl = this;

    // Запрашиваем список заказов
    ctrl.$onInit = function() {
        this.list = [];
        socket.emit('get orders');
    }

    // Получаем список заказов
    socket.on('orders list', (data) => {
        this.list = data;
    });

    // Когда заказ обновлён
    socket.on('order updated', () => {
        socket.emit('get orders');
    });
}

angular.module('clientApp').component('orderList', {
    templateUrl: 'modules/clientApp/components/orderList/orderList.html',
    controller: OrderListController
});