angular.module('battletime-portal')
.service('config', function(){

    return {
        apiRoot: "https://battletime.herokuapp.com/api", 
        //apiRoot: "http://localhost:3000/api"
    }

});