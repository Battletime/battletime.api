angular.module('battletime-portal')
.controller('UsersCtrl', function($scope, $http, $window, config){
    
    $scope.users;


    function init(){
         $scope.getUsers();
    }

    $scope.getUsers = function(){
        $http.get(config.apiRoot + '/users')
            .then((response) => {
                $scope.users = response.data;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.addUser = function(){
         $http.post(config.apiRoot + '/users', $scope.newUser)
            .then((response) => {
                $scope.users.push(response.data);
                $scope.newUser = null;
            },(response) =>{
                console.log(response.data);
            });
    }

    init();
})
