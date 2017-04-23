angular.module('battletime-portal', ["ngRoute"])
.config(function($routeProvider) {

    $routeProvider
        .when("/", {
            templateUrl : "templates/portal/portal.comp.html"
        })

}); 