function TimerController($interval) {
    var ctrl = this;

    // Инициализация таймера, рассчет секунд
    ctrl.$onInit = function() {
        let startTime = Math.floor(new Date(ctrl.order.cooking_start_date).getTime() / 1000, 0);
        let now = Math.floor(new Date(ctrl.order.currentDate).getTime() / 1000, 0);
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

}

angular.module('kitchenApp').component('timer', {
    templateUrl: 'modules/kitchenApp/components/timer/timer.html',
    controller: TimerController,
    bindings: {
        order: '<'
    }
});