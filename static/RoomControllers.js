/**
 * Created by David on 2/15/2015.
 */

var roomControllers = angular.module('roomControllers', []);

roomControllers.controller('roomCtrl', ['$scope', 'rooms',
    function($scope, rooms){
        console.log('before query');
        $scope.rooms = rooms.query();
        console.log('after');
        $scope.rooms.$promise.then(function(data){
            console.log('in the promise');
            $scope.messages = data['messages'];         // get messages for roomz
        })
    }
]);