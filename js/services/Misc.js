/**
 * Created by Lander on 14-9-11.
 */

app.factory('Misc', function ($timeout, $log) {
//Функция сетваща деолт стойности на конфигурационния обект

    var MiscObject = {};
    MiscObject.toast = function (msg, type, delay) {//Алтернативен alert
        $('<div class="alert alert-' + type + '" role="alert"><h3>' + msg + '</h3></div>')
            .css({
                display: "block",
                opacity: 0.9,
                position: "fixed",
                padding: "7px",
                "font-size": "10px",
                "text-align": "center",
                "text-shadow": "none",
                width: "340px",
                left: ($(window).width() - 284) / 2,
                top: $(window).height() / 2
            })
            .appendTo('body').delay(delay)
            .fadeOut(900, function () {
                $(this).remove();
            });
    };//
    MiscObject.current_promise = null;
    MiscObject.setTimeout = function (scope, fn, delay) {
        var promise = $timeout(fn, delay);
        MiscObject.current_promise = promise;
        //$log.debug(MiscObject.current_promise);
        var deregister = scope.$on('$destroy', function () {
            $timeout.cancel(promise);
        });

        promise.then(deregister);
    };
    MiscObject.cancelTimeout = function () {
        $timeout.cancel(MiscObject.current_promise);
        $log.debug(MiscObject.current_promise);
    };


    return MiscObject;


});