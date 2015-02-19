/**
 * Created by David on 2/15/2015.
 */
var roomServices = angular.module('roomServices', ['ngResource']);

roomServices.factory('rooms', ['$resource',
    function($resource){
        return $resource('/room/:room_id', {room_id: '@room_id'}, {
            query: {method: 'GET', params:{}, isArray:true}
        });
    }]);
