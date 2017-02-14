function OrderItemController(socket) {
    var ctrl = this;

    // Отменить заказ
    ctrl.cancelOrder = function() {
        socket.emit('cancel order', {
            order: this.item
        });
    }

    // Ответ на статус "возникли сложности"
    ctrl.troubles = function(resolution) {
        socket.emit('troubles resolution', {
            order: this.item,
            resolution: resolution
        });
    }

    // Перевод статусов на русский язык
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