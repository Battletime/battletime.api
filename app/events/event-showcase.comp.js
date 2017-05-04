angular.module('battletime-portal')
.controller('EventShowcaseCtrl', function($scope, $http, $stateParams, $window,  $sce,   config){

    //properties
    $scope.event;

    //socket eveents
     $window.socket.on('signup', function(participants){
        $scope.event.participants = participants;
        $scope.$apply(); //scope modified outside angular context
    });


    function init(){
        document.getElementById('navbar').style.display = 'none'; //hide menu;
        $scope.getEvent($stateParams.eventId);
    }

    $scope.getEvent = function(id){
        $http.get(config.apiRoot + '/events/' + id)
            .then((response) => {
                $scope.event = response.data;
                $scope.event.qrImage =  $sce.trustAsHtml($scope.event.qrImage);
            }, onError);
    }


    function onError(response){
        console.log(response.data);
    }

    init();
});
    

