function TimerController($interval) {
    var ctrl = this;

    ctrl.$onInit = function() {
        let startTime = Math.round(new Date(ctrl.order.cooking_start_date).getTime() / 1000, 0);
        let now = Math.floor(Date.now() / 1000, 0);
        ctrl.timerValue = now - startTime;
    }

    let interval = $interval(incrementTimer, 1000);

    function incrementTimer() {
        ctrl.timerValue += 1;
    }

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