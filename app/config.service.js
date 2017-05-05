angular.module('battletime-portal')
.service('config', function(){

    var serverRoot = "https://battletime.herokuapp.com";
    //var serverRoot = "http://localhost:3000";

    return {
        serverRoot: serverRoot,
        apiRoot: serverRoot + "/api"
    }

});