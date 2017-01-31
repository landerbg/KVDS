/**
 * Created by Lander on 14-9-12.
 */
app.controller('ConfigController', function ($scope, Misc, StateService) {
    $scope.st.position = 0;
    $("html, body").animate({scrollLeft: 0}, 200);
    $scope.misc = Misc;
    $scope.state = StateService;
    $scope.config_saved = true;
    $scope.config_saved_error = true;
    $scope.msg = "";
    $scope.stop_app();

    $scope.hide_alerts = function () {
        $scope.config_saved = true;
    }
    $scope.save_config = function () {
        $scope.msg = $scope.configuration.saveConfiguration();
        $scope.config_saved = false;

        $scope.misc.toast("Настройките са запазени успешно.", "success", 3000);
        $scope.state.max_porid = 0;
        $scope.state.visible_por = [];
        $scope.state.lineStyle = [];
        $scope.state.bumped_por = [];
        Misc.cancelTimeout();
    }
    $scope.reset_config = function () {
        if (confirm("Желаете ли да Нулирате настройките!")) {
            $scope.msg = $scope.configuration.resetConfiguration();
            $scope.config_saved = false;
            $scope.misc.toast("Настройките са по подразбиране!", "warning", 3000);
            $scope.state.max_porid = 0;
            $scope.state.visible_por = [];
            $scope.state.lineStyle = [];
            $scope.state.bumped_por = [];


            Misc.cancelTimeout();//Towa da se proweri dali spira функцията която тегли поръчки
        }
    }
    $scope.save_printers = function () {
        var printers = JSON.stringify($scope.configuration.selected_printers);
    }
});