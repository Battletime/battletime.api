angular.module('battletime-portal')
.controller('AppCtrl', function($scope, $http, authService){
 
    //properties
    $scope.auth = authService;

});
