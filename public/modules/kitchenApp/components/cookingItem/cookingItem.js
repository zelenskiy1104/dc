function CookingItemController(socket) {
    var ctrl = this;

    this.startDelievery = function() {
        socket.emit('start delievery', {
            id: this.item._id
        });
    }
}

angular.module('kitchenApp').component('cookingItem', {
    templateUrl: 'modules/kitchenApp/components/cookingItem/cookingItem.html',
    controller: CookingItemController,
    bindings: {
        item: '<',
    }
});