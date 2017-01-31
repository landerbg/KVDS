
var app = angular.module('KVDS', ['ngRoute', 'ui.bootstrap']).config(function($routeProvider) {
    $routeProvider
   .when('/', {
            templateUrl:'parts/home.html',
            controller : 'TerminalController'

    }).when('/config', {
            templateUrl:'parts/config.html',
            controller : 'ConfigController'

        }).when('/void', {
            templateUrl:'parts/void.html',
            controller : 'VoidController'

        })
        .when('/summary', {
            templateUrl:'parts/summary.html',
            controller: 'SummaryController'

        })
        .when('/test', {
            templateUrl:'parts/test.html',
            controller: 'DemoController'

        })
        .when('/sort', {
            templateUrl:'parts/sort.html',
            controller: 'SortController'

        })

        .otherwise({redirectTo: '/'});
    })

app.filter('secondsToDateTime', [function() { //Превръща брояча в минути : секунди
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])

app.run(function() { //маха 300мс забавяне
    FastClick.attach(document.body);
});




















