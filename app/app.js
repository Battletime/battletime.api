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