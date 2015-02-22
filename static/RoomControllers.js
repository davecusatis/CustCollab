/**
 * Created by David on 2/15/2015.
 */

var roomControllers = angular.module('roomControllers', []);

roomControllers.controller('roomCtrl', ['$scope', '$location', 'rooms',
    function($scope, $location, rooms){
        var url = $location.url();
        var roomid = getRoomID(url);
        $scope.user = 'unknown';

        $scope.messages = [{name: 'test', body: 'test'}];
        $scope.messageText = '';
        $scope.rooms = rooms.get({room_id: roomid});

        $scope.submit = function(name) {
            if ($scope.messageText) {
                $scope.messages.push({name: 'test', body: $scope.messageText});
                $scope.messageText = '';
            }

            // now save to DB -- this is bad for performance but just for now.
            rooms.post({room_id: roomid, messages: $scope.messages});
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