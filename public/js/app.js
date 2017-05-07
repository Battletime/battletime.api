angular.module('battletime-portal', ["ui.router", 'ui.select', 'ngSanitize'])


.config(function($stateProvider, $urlRouterProvider) {

    function getCompState(name){
        return {
            name: name,
            url: '/' + name,
            templateUrl: 'templates/' + name + '/' + name + '.comp.html',
        }
    }

    $stateProvider.state(getCompState("portal"));
    $stateProvider.state(getCompState("events"));
    $stateProvider.state(getCompState("users"));
    $stateProvider.state(getCompState("battles"));

    $stateProvider.state({
            name: "eventDetails",
            url: '/event/:eventId',
            templateUrl: 'templates/events/event-details.comp.html'
    });

        $stateProvider.state({
            name: "eventShowcase",
            url: '/event/:eventId/showcase',
            templateUrl: 'templates/events/event-showcase.comp.html'
    });
    

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('portal');
    });
}).filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
}).filter('image', function(config){
    return function(input){
        
        if(input && input[0] == '/')
            return config.serverRoot + input;
        else{
            return input;
        }
    }
});
angular.module('battletime-portal')
.controller('AppCtrl', function($scope, $http, authService){
 
    //properties
    $scope.auth = authService;

});

angular.module('battletime-portal')
.service('authService', function($http, $q, config){
    
    var self = {};

    self.isAdmin = function() {
        return this.user && this.user.role == "admin";
    }

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

        $http.post(config.apiRoot + '/auth/login', login)
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

        $http.post(config.apiRoot + '/auth/signup', signup)
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
.service('battleService', function($http, $q, config){

   var self = {};

    self.sendAction = function(battleId, action){
         return $http.post(config.apiRoot + '/battles/' + battleId+ '/actions', { action: action})
    }

    return self;

});
angular.module('battletime-portal')
.service('config', function(){

    var serverRoot = "https://battletime.herokuapp.com";
    //var serverRoot = "http://localhost:3000";

    return {
        serverRoot: serverRoot,
        apiRoot: serverRoot + "/api"
    }

});
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
          $scope.sendAction(index, 'stop'); //stop current battle
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
    


angular.module('battletime-portal')
.controller('EventShowcaseCtrl', function($scope, $state, $http, $timeout, $stateParams, $window, $filter, $sce, config){

    //properties
    $scope.event;
    $scope.showPromo;

    $scope.statusFiler = {
        status: 'idle'
    }

    //socket eveents
     $window.socket.on('signup', function(participants){
        $scope.event.participants = participants;
        $scope.$apply(); //scope modified outside angular context
    });

    $window.socket.on('signout', function(participants){
        $scope.event.participants = participants;
        $scope.$apply(); //scope modified outside angular context
    });

    $window.socket.on('event.action', function(event){
        if($scope.event._id != event._id){
            $state.go('eventShowcase', { eventId: event._id });
        }
        $scope.event = event;
        setBattles($scope.event);
        $scope.$apply(); //scope modified outside angular context
    });

    $window.socket.on('battle.update', function(battle){
        if($scope.currentBattle._id == battle._id)
        {
            $scope.currentBattle = battle;
            $scope.$apply(); //scope modified outside angular context
        }
    });


    $window.socket.on('battle.action', function(updatedBattle){
        $scope.loadNextBattle = true;
        $timeout(() => {
            $scope.event.battles.forEach((battle, index, list) => {
                if(battle._id == updatedBattle._id){
                    list[index] = updatedBattle;
                }
            }, this);
            setBattles($scope.event); 
            $timeout(() => { $scope.loadNextBattle = false; }, 1500);
        }, 1500) //wait for images to leave the screen
        $scope.$apply(); //scope modified outside angular context
    });


    function setBattles(event){
        var orderedBattles = $filter('orderBy')(event.battles, 'meta');
        var firstStarted = $filter('filter')(orderedBattles, { status: { id: 1 }})[0];
        var firstIdle = $filter('filter')(orderedBattles, { status: { id: 0 }})[0];
        $scope.currentBattle = firstStarted;
        $scope.nextBattle = firstIdle;
    }

    function toggleShowPromo(){
          $timeout(() => { 
              $scope.showPromo = !$scope.showPromo;
              toggleShowPromo();
          }, 10000);
    }

    
    function init(){
        document.getElementById('navbar').style.display = 'none'; //hide menu;
        $scope.getEvent($stateParams.eventId);
        toggleShowPromo();
    }

    $scope.getEvent = function(id){
        $http.get(config.apiRoot + '/events/' + id)
            .then((response) => {
                $scope.event = response.data;
                setBattles($scope.event);
                $scope.event.qrImage =  $sce.trustAsHtml($scope.event.qrImage);
            }, onError);
    }


    function onError(response){
        console.log(response.data);
    }

    init();
});
    


angular.module('battletime-portal')
.controller('EventsCtrl', function($scope, $http, $window, config){
    
    $scope.msg = "hello";
    
    function init(){
         $scope.getEvents();
    }

    $scope.aanmelden = function(secret){
        $http.post(config.apiRoot + '/events/'+secret+'/participants')
            .then((event) => {
            });
    }

    $scope.getEvents = function(){
        $http.get(config.apiRoot + '/events')
            .then((response) => {
                $scope.events = response.data;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.addEvent = function(){
         $http.post(config.apiRoot + '/events', $scope.newEvent)
            .then((response) => {
                $scope.events.push(response.data);
                $scope.newEvent = null;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.sendAction = function(index, action){
         $http.post(config.apiRoot + '/events/' + $scope.events[index]._id + '/actions', { action: action})
            .then((response) => {
                $scope.events[index] = response.data;
            },(response) =>{
                console.log(response.data);
            });
    }

    $scope.stopEvent = function(event){
        event.stoppedOn = new Date();
    }

    $scope.reset = function(event){
        event.startedOn = null;
        event.stoppedOn = null;
    }

    init();
})

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
