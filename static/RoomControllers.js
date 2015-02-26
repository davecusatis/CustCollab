/**
 * Created by David on 2/15/2015.
 */

var roomControllers = angular.module('roomControllers', ['ngCookies']);

roomControllers.controller('roomCtrl', ['$scope', '$cookies', '$location', 'rooms', 'roomsPost', 'user',
    function($scope, $cookies, $location, rooms, roomsPost, user){
        var url = $location.url();
        var roomid = getRoomID(url);
        $scope.user = 'unknown';

        $scope.messages = [{name: 'test', body: 'test'}];
        $scope.messageText = '';
        $scope.rooms = rooms.get({room_id: roomid});
        $scope.user = user.get();

        $scope.submit = function(name) {
            if ($scope.messageText) {
                roomsPost.post({room_id: roomid}, {messages: $scope.messageText});
                $scope.messages.push({user: $scope.user, body: $scope.messageText});
                $scope.messageText = '';
            }

        };

        $scope.setUser = function(user) {
            $scope.user = user;
        };
        $scope.rooms.$promise.then(function(data){
            console.log('roomid: ' + roomid);
            $scope.messages = data;         // get messages for roomz
        });
    }
]);

roomControllers.controller('submitCtrl', ['$scope',
    function($scope){

    }
]);
var getRoomID = function(url){
    var re = '/room/.*';
    if(url === '/'){
        return 'index';
    }
    var roomId = re.match(url);
    return roomId;
};