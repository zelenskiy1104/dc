function OrderItemController(socket) {
    var ctrl = this;

    ctrl.troubles = function(resolution) {
        socket.emit('troubles resolution', {
            order: this.item,
            resolution: resolution
        });
    }

    ctrl.translate = function(status) {
        var dictionary = {
            order: 'заказано',
            cooking: 'готовится',
            delievery: 'доставляется',
            ready: 'подано',
            troubles: 'возникли сложности'
        };

        return dictionary[status];
    }
}

angular.module('clientApp').component('orderItem', {
    templateUrl: 'modules/clientApp/components/orderItem/orderItem.html',
    controller: OrderItemController,
    bindings: {
        item: '<',
    }
});