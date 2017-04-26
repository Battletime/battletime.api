angular.module('battletime-portal')
.controller('PortalCtrl', function($scope, $http, config, authService){
 
    //properties
    
    $scope.battles;
    $scope.login = {
        username: authService.getLastUsedUsername()
    };

    function init(){
        $scope.auth = authService;

        if($scope.auth.user){
            $scope.getMyBattles();
        }
        
    }


    //functions
    $scope.logout= function(){
        authService.Logout();
    }

    $scope.sendSignup = function(){
        authService.Signup($scope.signup).then(
            (user) => {
                $scope.signup.password = null;
                $scope.signup.repeat = null; 
            }, 
            (response) => {
                $scope.signup.errors = response.errors;
                //empty password fiels
                $scope.signup.password = null;
                $scope.signup.repeat = null; 
            });
    }

    $scope.getMyBattles = function(){
        $http.get(config.apiRoot + '/users/' + $scope.auth.user._id + '/battles')
            .then((response) => {
                $scope.battles = response.data;
            })
    }

    $scope.getStatus = function(battle){
        if(!battle.startedOn)
            return "Not yet started";
        if(!battle.stoppedOn)
            return "In progress";
        else
            return "Finished";
        
    }


    $scope.sendLogin = function(){
        authService.Login($scope.login).then(
        (user) => {
            $scope.getMyBattles();
        }, 
        (response) => {
            $scope.login.errors = response.errors
        });

      
    }

    init();
})
