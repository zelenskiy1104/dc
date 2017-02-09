function CookingListController(socket) {
    var ctrl = this;

    this.list = [];

    socket.emit('get kitchen orders', {status: 'cooking'});

    socket.on('kitchen cooking list', (data) => {
        this.list = data;
    });

    socket.on('order lists updated', () => {
        socket.emit('get kitchen orders', {status: 'cooking'});
    });
}

angular.module('kitchenApp').component('cookingList', {
    templateUrl: 'modules/kitchenApp/components/cookingList/cookingList.html',
    controller: CookingListController
});