angular.module('battletime-portal')
.controller('EventShowcaseCtrl', function($scope, $state, $http, $timeout, $stateParams, $window, $filter, $sce,   config){

    //properties
    $scope.event;

    $scope.statusFiler = {
        status: 'idle'
    }

    //socket eveents
     $window.socket.on('signup', function(participants){
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

    
    function init(){
        document.getElementById('navbar').style.display = 'none'; //hide menu;
        $scope.getEvent($stateParams.eventId);
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
    

