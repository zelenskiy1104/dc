function TimerController($interval) {
    var ctrl = this;

    ctrl.$postLink = function() {
        let startTime = Math.floor(new Date(ctrl.order.order_start_date).getTime() / 1000, 0);
        let now = Math.round(Date.now() / 1000, 0);

        if (ctrl.order.status == 'ready' || ctrl.order.status == 'troubles') {
            now = Math.round(new Date(ctrl.order.cooking_finish_date).getTime() / 1000, 0);
        }

        ctrl.timerValue = now - startTime;
    }

    let interval = $interval(incrementTimer, 1000);

    function incrementTimer() {
        ctrl.timerValue += 1;
    }

    ctrl.$onDestroy = function() {
        $interval.cancel(interval);
    }

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