angular.module('battletime-portal')
.controller('EventsCtrl', function($scope, $http, $window){
    
    $scope.msg = "hello";

    // $window.socket.on('signup', function(event){
    //     $scope.event.participants.push('' + 2);
    //      $scope.$apply(); //scope modified outside angular context
    // });

    $scope.aanmelden = function(secret){
        $http.post('http://localhost:3000/api/events/'+secret+'/participants')
            .then((event) => {
            });
    }
})
