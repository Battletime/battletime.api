angular.module('battletime-portal')
.controller('EventDetailsCtrl', function($scope, $http, $stateParams, $window,  $sce,   config){

    //properties
    $scope.event;
    $scope.users;

    //socket eveents
     $window.socket.on('signup', function(participants){
        $scope.event.participants = participants;
        $scope.$apply(); //scope modified outside angular context
    });


    function init(){
        $scope.getEvent($stateParams.eventId);
        $scope.getUsers();
    }

    $scope.addParticipant = function(userId){
        $http.post(config.apiRoot + '/events/' + $scope.event._id + '/participants', { userId: userId })
            .then((event) => {
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

    function onError(response){
        console.log(response.data);
    }

    init();
});
    

