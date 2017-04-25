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
.controller('AppCtrl', function($scope, $http, authService){
 
    //properties
    $scope.auth = authService;

});

angular.module('battletime-portal')
.service('authService', function($http, $q){
    
    var self = {};

    var savedUser = localStorage.getItem("user");
    self.user = savedUser ? JSON.parse(savedUser) : null;

    function saveUser(user){
        self.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("lastUsername", user.username);
    }

    self.getLastUsedUsername = function(){
        return localStorage.getItem("lastUsername");
    }

    self.Login = function(login){
        var deferred = $q.defer();

        $http.post('http://localhost:3000/api/auth/login', login)
            .then((response) => {
                saveUser(response.data);
                deferred.resolve(response.data)
            },(response) =>{
                deferred.reject(response.data)
            });

        return deferred.promise;
    }
    
    self.Logout = function(){
        localStorage.removeItem("user", undefined);
        self.user = null;
    }

    self.Signup = function(signup){

        var deferred = $q.defer();

        if(signup.password != signup.repeat){
             deferred.reject({ errors: ["The passwords do not match"]});
             return deferred.promise;
        };

        $http.post('http://localhost:3000/api/auth/signup', signup)
            .then((response) => {
                saveUser(response.data);
                deferred.resolve(response.data)
            },(response) =>{
                deferred.reject(response.data)
            });

        return deferred.promise;
    }

    return self;

})
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
        (user) => {}, 
        (response) => {
            $scope.signup.errors = response.errors
        });

        //empty password fiels
        $scope.signup.password = null;
        $scope.signup.repeat = null; 
        
    }

    $scope.sendLogin = function(){
        authService.Login($scope.login).then(
        (user) => {}, 
        (response) => {
            $scope.login.errors = response.errors
        });

      
    }
})
