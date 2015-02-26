/**
 * Created by David on 2/11/2015.
 */

'use strict';
var mainApp = angular.module('ChatApp', ['ngRoute', 'ngCookies',
    'roomControllers', 'roomServices'
]);
mainApp.config(function($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '/static/chat.html',
            controller: 'roomCtrl'
        }).
        when('/room/(.*)', {
        templateUrl: 'templates/index.html',
        controller: 'roomCtrl'
        });

        //$http.defaults.headers.post['Cookie'] = $cookies['chatdemo_user'];
});

mainApp.run(['$http', '$cookieStore', '$cookies', function($http, $cookieStore, $cookies){

  $http.defaults.xsrfCookieName = '_xsrf';
  $http.defaults.xsrfHeaderName = 'X-XSRFToken';
}]);