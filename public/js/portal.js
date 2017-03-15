angular.module('portal', [])

.controller('EventCtrl', function($scope, $http, $window){
    $scope.msg = "hello";



    $scope.initialize = function(event){
        $scope.event = event;
    }

    $window.socket.on('signup', function(event){
        $scope.event.participants.push('' + 2);
         $scope.$apply(); //scope modified outside angular context
    });

    $scope.aanmelden = function(secret){
        $http.post('http://localhost:3000/api/events/'+secret+'/participants')
            .then((event) => {
            });
    }
})
