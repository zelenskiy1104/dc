function TimerController($interval) {
    var ctrl = this;

    // Инициализация таймера, рассчет секунд
    ctrl.$onInit = function() {
        let startTime = Math.floor(new Date(ctrl.order.order_start_date).getTime() / 1000, 0);
        let now = Math.floor(new Date(ctrl.order.currentDate).getTime() / 1000, 0);

        if (ctrl.order.status == 'ready' || ctrl.order.status == 'troubles') {
            now = Math.floor(new Date(ctrl.order.order_finish_date).getTime() / 1000, 0);
        }

        ctrl.timerValue = now - startTime;
    }

    let interval = $interval(incrementTimer, 1000);

    // Увеличить таймер на 1
    function incrementTimer() {
        ctrl.timerValue += 1;
    }

    // При удалении таймера - удаляем интервал
    ctrl.$onDestroy = function() {
        $interval.cancel(interval);
    }

    // Следим за изменением статуса заказа
    ctrl.$onChanges = function (changesObj) {
        if (changesObj.order) {
            if (ctrl.order.status == 'ready' || ctrl.order.status == 'troubles') {
                $interval.cancel(interval);
            }
        }
    };

}

angular.module('clientApp').component('timer', {
    templateUrl: 'modules/clientApp/components/timer/timer.html',
    controller: TimerController,
    bindings: {
        order: '<'
    }
});