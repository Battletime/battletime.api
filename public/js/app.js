angular.module('battletime-portal', ["ui.router"])
.config(function($stateProvider, $urlRouterProvider) {

    function getCompState(name){
        return {
            name: name,
            url: '/' + name,
            templateUrl: 'templates/' + name + '/' + name + '.comp.html'
        }
    }

    $stateProvider.state(getCompState("portal"));
    $stateProvider.state(getCompState("events"));

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('portal');
    });


});

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

angular.module('battletime-portal')
.controller('PortalCtrl', function($scope, $http, $window){
    
    $scope.msg = "hello world";


})
