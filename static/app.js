/**
 * Created by David on 2/11/2015.
 */

'use strict';
var mainApp = angular.module('ChatApp', ['ngRoute',
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

    $httpProvider.defaults.xsrfCookieName = 'chatdemo_user';
    //$locationProvider.html5mode(true);
});