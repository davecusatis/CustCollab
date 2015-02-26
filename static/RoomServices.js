/**
 * Created by David on 2/15/2015.
 */
var roomServices = angular.module('roomServices', ['ngResource']);

roomServices.factory('rooms', ['$resource',
    function($resource){
        return $resource('/room/:room_id', {room_id: '@room_id'}, {
            get: {method: 'GET', params:{room_id: '@room_id'}, isArray:true},
        });
    }]);

roomServices.factory('roomsPost', ['$resource',
    function($resource){
        return $resource('/a/message/new', {room_id: '@room_id', body: '@messages'},{
            post: {method: 'POST', params: { room_id: '@room_id', body: '@messages'}, isArray:true}
        })
    }]);
roomServices.factory('user', ['$resource',
    function($resource){
        return $resource('/a/user/', {}, {
           get: {method: 'POST', params: {}, isArray: false}
        });
    }]);