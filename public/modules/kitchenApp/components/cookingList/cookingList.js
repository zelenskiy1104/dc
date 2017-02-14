function CookingListController(socket) {
    var ctrl = this;

    this.list = [];

    // Запрашиваем заказы со статусом cooking
    socket.emit('get kitchen orders', {status: 'cooking'});

    // Получаем заказы со статусом cooking
    socket.on('kitchen cooking list', (data) => {
        this.list = data;
    });

    // Когда обновились заказы, запрашиваем свежий список
    socket.on('order lists updated', () => {
        socket.emit('get kitchen orders', {status: 'cooking'});
    });
}

angular.module('kitchenApp').component('cookingList', {
    templateUrl: 'modules/kitchenApp/components/cookingList/cookingList.html',
    controller: CookingListController
});