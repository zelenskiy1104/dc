function OrderListController(socket) {
    var ctrl = this;

    this.list = [];

    // Запрашиваем заказы со статусом order
    socket.emit('get kitchen orders', {status: 'order'});

    // Получаем заказы со статусом order
    socket.on('kitchen orders list', (data) => {
        this.list = data;
    })

    // Когда обновились заказы, запрашиваем свежий список
    socket.on('order lists updated', () => {
        socket.emit('get kitchen orders', {status: 'order'});
    });
}

angular.module('kitchenApp').component('orderList', {
    templateUrl: 'modules/kitchenApp/components/orderList/orderList.html',
    controller: OrderListController
});