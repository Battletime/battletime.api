angular.module('battletime-portal')
.controller('BattlesCtrl', function($scope, $http, $window, config, battleService){
    
    $scope.battles;
    $scope.users;
    $scope.newBattle = {
        participants: [] 
    };

    function init(){
        $scope.getBattles();
        $scope.getUsers();
    }

    $scope.sendAction = function(index, action){
        battleService.sendAction($scope.battles[index]._id, action)
            .then((response) => {
                $scope.battles[index] = response.data;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.getBattles = function(){
        $http.get(config.apiRoot + '/battles')
            .then((response) => {
                $scope.battles = response.data;
            }, onError);
    }

    $scope.getUsers = function(){
         $http.get(config.apiRoot + '/users')
            .then((response) => {
                $scope.users = response.data;
            }, onError);
    }

    $scope.addBattle = function(){
         $http.post(config.apiRoot + '/battles', $scope.newBattle)
            .then((response) => {
                $scope.battles.push(response.data);
                $scope.newBattle = {
                    participants: []
                };
            },onError);
    }

    function onError(response){
        console.log(response.data);
    }

    init();
})
