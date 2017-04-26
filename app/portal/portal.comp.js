angular.module('battletime-portal')
.controller('PortalCtrl', function($scope, $http, authService){
 
    //properties
    $scope.auth = authService;
    $scope.login = {
        username: authService.getLastUsedUsername()
    };

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

    $scope.sendLogin = function(){
        authService.Login($scope.login).then(
        (user) => {}, 
        (response) => {
            $scope.login.errors = response.errors
        });

      
    }
})
