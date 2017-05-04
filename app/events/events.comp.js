angular.module('battletime-portal')
.controller('EventsCtrl', function($scope, $http, $window, config){
    
    $scope.msg = "hello";
    
    function init(){
         $scope.getEvents();
    }

    $scope.aanmelden = function(secret){
        $http.post(config.apiRoot + '/events/'+secret+'/participants')
            .then((event) => {
            });
    }

    $scope.getEvents = function(){
        $http.get(config.apiRoot + '/events')
            .then((response) => {
                $scope.events = response.data;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.addEvent = function(){
         $http.post(config.apiRoot + '/events', $scope.newEvent)
            .then((response) => {
                $scope.events.push(response.data);
                $scope.newEvent = null;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.sendAction = function(index, action){
         $http.post(config.apiRoot + '/events/' + $scope.events[index]._id + '/actions', { action: action})
            .then((response) => {
                $scope.events[index] = response.data;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.stopEvent = function(event){
        event.stoppedOn = new Date();
    }

    $scope.reset = function(event){
        event.startedOn = null;
        event.stoppedOn = null;
    }

    init();
})
