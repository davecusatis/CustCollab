/**
 * Created by David on 2/15/2015.
 */

var roomControllers = angular.module('roomControllers', []);

roomControllers.controller('roomCtrl', ['$scope', 'rooms',
    function($scope, rooms){
        $scope.rooms = rooms.query();
        $scope.rooms.$promise.then(function(data){
            $scope.messages = data['messages'];         // get messages for roomz
        })
    }
]);