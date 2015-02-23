/**
 * Created by David on 2/15/2015.
 */
var roomServices = angular.module('roomServices', ['ngResource', 'ngCookie']);

roomServices.factory('rooms', ['$resource', '$cookies',
    function($resource){
        return $resource('/room/:room_id', {room_id: '@room_id'}, {
            get: {method: 'GET', params:{room_id: '@room_id'}, isArray:true},
            post: {method: 'POST', params: {room_id: '@room_id', messages: '@messages'}, isArray:false}
        });
    }]);

roomServices.factory('user', ['$resource',
    function($resource){
        return $resource('/user/', {}, {
           get: {method: 'GET', params: {}, isArray: false}
        });
    }]);