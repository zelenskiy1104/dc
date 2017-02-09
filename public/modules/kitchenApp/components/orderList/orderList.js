function OrderListController(socket) {
    var ctrl = this;

    this.list = [];

    socket.emit('get kitchen orders', {status: 'order'});

    socket.on('kitchen orders list', (data) => {
        this.list = data;
    })

    socket.on('order lists updated', () => {
        socket.emit('get kitchen orders', {status: 'order'});
    });
}

angular.module('kitchenApp').component('orderList', {
    templateUrl: 'modules/kitchenApp/components/orderList/orderList.html',
    controller: OrderListController
});