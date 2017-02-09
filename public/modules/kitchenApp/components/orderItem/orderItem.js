function OrderItemController(socket) {
    var ctrl = this;

    this.startCooking = function() {
        socket.emit('start cooking', {
            id: this.item._id
        });
    }
}

angular.module('kitchenApp').component('orderItem', {
    templateUrl: 'modules/kitchenApp/components/orderItem/orderItem.html',
    controller: OrderItemController,
    bindings: {
        item: '<',
    }
});