/**
 * Created by Lander on 14-9-12.
 */
app.controller('VoidController', function ($scope, $log, Misc, StateService) {

    $scope.st.position = 0;
    $("html, body").animate({scrollLeft: 0}, 200);
    $scope.stop_app();


});
