/**
 * Created by David on 2/11/2015.
 */

'use strict';
var mainApp = angular.module('ChatApp', ['ngRoute', 'ngCookies',
    'roomControllers', 'roomServices'
]);

mainApp.config(function($routeProvider, $httpProvider, $cookies, $locationProvider) {
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