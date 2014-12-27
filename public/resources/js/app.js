/**
 * Bootstrap the base module for application
 */
var railways = angular.module('railways',['ngRoute','kinvey','railwayControllers']).run(function($kinvey,$location,$rootScope) {
    var promise = $kinvey.init({
        appKey    : 'kid_bJ8tXtd9d',
        appSecret : 'be0e1b6260004b8cae33ffbebed4d5c2',
        refresh : false
    });

    promise.then(function(activeUser) {
        if(null != activeUser){
            $rootScope.miscClass = '';

            $location.path('/trains')
        }
    }, function(error) {
        console.log(error)
    })
});

railways.config(['$routeProvider',function($routeProvider){
    $routeProvider.
        when('/login', {
            templateUrl: 'resources/partials/login.html',
            controller: 'AuthController'
        }).
        when('/logout', {
            controller: 'LogoutController',
            templateUrl : 'resources/partials/bus.html'
        }).
        when('/trains', {
            templateUrl: 'resources/partials/train.html',
            controller: 'TrainListController'
        }).
        when('/booking/:trainNo', {
            templateUrl: 'resources/partials/booking.html',
            controller: 'BookingController'
        }).
        when('/bookingHistory', {
            templateUrl: 'resources/partials/bookingHistory.html',
            controller: 'BookingHistoryController'
        }).
        otherwise({redirectTo :'/login'})
}])
