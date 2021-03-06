function MenuItemController(socket) {
    var ctrl = this;

    ctrl.addLinkText = 'добавить';

    // Добавить блюдо в заказ
    this.addToOrder = function() {
        socket.emit('add to order', {
            menu: this.item
        });

        ctrl.addLinkText = 'добавить ещё'
    }

    // Определяем, хватает ли денег для заказа
    ctrl.$onChanges = function() {
        ctrl.canOrder = true;
        ctrl.difference = ctrl.item.price - ctrl.balance;
        if (ctrl.difference > 0) {
            ctrl.canOrder = false;
        }
    }
}

angular.module('clientApp').component('menuItem', {
    templateUrl: 'modules/clientApp/components/menuItem/menuItem.html',
    controller: MenuItemController,
    bindings: {
        item: '<',
        balance: '<'
    }
});