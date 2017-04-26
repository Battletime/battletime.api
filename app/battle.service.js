angular.module('battletime-portal')
.service('battleService', function($http, $q, config){

   var self = {};

    self.sendAction = function(battleId, action){
         return $http.post(config.apiRoot + '/battles/' + battleId+ '/actions', { action: action})
    }

    return self;

});