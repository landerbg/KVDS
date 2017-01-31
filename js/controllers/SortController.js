app.controller('SortController', function ($scope, $log) {

    $scope.st.position = 0;
    $("html, body").animate({scrollLeft: 0}, 200);
    $scope.stop_app();
});