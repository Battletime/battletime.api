angular.module('battletime-portal')
.controller('EventDetailsCtrl', function($scope, $http, $stateParams, $window,  $sce,   config){

    //properties
    $scope.event;
    $scope.users;
    $scope.form = {
        participants : []   
    }

    //socket events!
     $window.socket.on('signup', function(participants){
        $scope.event.participants = participants;
        $scope.$apply(); //scope modified outside angular context
    });

     $window.socket.on('signout', function(participants){
        $scope.event.participants = participants;
        $scope.$apply(); //scope modified outside angular context
    });

    function init(){
        $scope.getEvent($stateParams.eventId);
        $scope.getUsers();
    }

    $scope.addParticipants = function(participants){
        $http.post(config.apiRoot + '/events/' + $scope.event._id + '/participants', participants)
            .then((event) => {
                //participant is added via socket
                $scope.form.participants = []
            }, onError);
    
    }

    $scope.removeParticipant = function(participant){
        $http.delete(config.apiRoot + '/events/' + $scope.event._id + '/participants/' + participant._id)
            .then((event) => {
                //participant is removed via socket
            }, onError);
    }

    $scope.getEvent = function(id){
        $http.get(config.apiRoot + '/events/' + id)
            .then((response) => {
                $scope.event = response.data;
                $scope.event.qrImage =  $sce.trustAsHtml($scope.event.qrImage);
            }, onError);
    }

    $scope.getUsers = function(){
         $http.get(config.apiRoot + '/users')
            .then((response) => {
                $scope.users = response.data;
            }, onError);
    }

    $scope.generateBattles = function(){
        $http.put(config.apiRoot + '/events/' + $scope.event._id  + '/battles')
            .then((response) => {
                $scope.event.battles = response.data;
            }, onError);
    }

    function onError(response){
        console.log(response.data);
    }

    init();
});
    

