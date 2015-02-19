/**
 * Created by David on 2/11/2015.
 */

'use strict';
var mainApp = angular.module('ChatApp', ['ngRoute',
    'roomControllers', 'roomServices'
]);

mainApp.config(function($routeProvider, $httpProvider) {
    $routeProvider.
        when('/room/(.*)', {
        templateUrl: 'templates/index.html',
        controller: 'roomCtrl'
        });
});
