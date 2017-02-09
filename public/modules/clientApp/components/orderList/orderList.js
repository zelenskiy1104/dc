function OrderListController(socket) {
    var ctrl = this;

    ctrl.$onInit = function() {
        this.list = [];
        socket.emit('get orders');
    }

    socket.on('orders list', (data) => {
        this.list = data;
    });

    socket.on('order updated', () => {
        socket.emit('get orders');
    });
}

angular.module('clientApp').component('orderList', {
    templateUrl: 'modules/clientApp/components/orderList/orderList.html',
    controller: OrderListController
});