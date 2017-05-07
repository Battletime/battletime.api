angular.module('battletime-portal')
.controller('EventDetailsCtrl', function($scope, $http, $stateParams, battleService, $window,  $sce,   config){

    //properties
    $scope.event;
    $scope.users;
    $scope.form = {
        participants : []   
    }

    $scope.eventForm = {
        participants : []   
    }

    $scope.sendAction = function(index, action){
        if($scope.event.battles.length > index){
            battleService.sendAction($scope.event.battles[index]._id, action)
                .then((response) => {
                    $scope.event.battles[index] = response.data;
                },(response) =>{
                    console.log(response.data);
                });
        }
    }

    $scope.showcase = function(){
        $http.put(config.apiRoot + '/events/' + $scope.event._id + '/showcase', {})
            .then((response) => {
                    alert('This event is now begin showed on the big screen!');
                },(response) =>{
                    console.log(response.data);
                });
    }

    $scope.sendEventAction = function(action){
       
            $http.post(config.apiRoot + '/events/' + $scope.event._id + '/actions', { action: action})
                .then((response) => {
                    $scope.event = response.data;
                },(response) =>{
                    console.log(response.data);
                });
    }

    $scope.next = function(index){  
        if(index == ($scope.event.battles.length - 1)) //no next battle
        {
            //stop event
            $scope.sendEventAction('stop');
        }
        else
        {
            $scope.sendAction((index + 1), 'start')
        }     
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

    $scope.isWinner = function(user){
        var isWinner = false;
        $scope.event.winners.forEach((winner) => {
            if(winner.user == user._id)
                isWinner = true;
        });
        return isWinner;
    }

    $scope.addWinner = function(user){
        if($scope.isWinner(user)){
            $scope.event.winners.forEach((winner, index, object) => {
                if(winner.user == user._id)
                     object.splice(index, 1);
            });
        }
        else{
            $scope.event.winners.push({ user: user._id });
        }
    }

    $scope.setWinner = function(battleId, user){
        $http.put(config.apiRoot + '/battles/' + battleId + '/winner', {userId: user._id})
            .then((response) => {
                $scope.event.battles.forEach((battle, index, list) => {
                    if(battle._id == response.data._id){
                         $scope.event.battles[index] = response.data;
                    }
                });
               
            }, onError)
    }

    $scope.submitWinners = function(){
        
    }

    $scope.generateEvent = function(participant){

    }

    $scope.getEvent = function(id){
        $http.get(config.apiRoot + '/events/' + id)
            .then((response) => {
                $scope.event = response.data;
                $scope.form.participants = event.participants;
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
    

