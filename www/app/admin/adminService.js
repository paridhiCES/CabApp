/*angular.module('adminhome')

.service('adminService', function($http, $q) {
    this.getEmpData = function() {
        var def = $q.defer();
        var response = "";
        $http.get("http://localhost:8005/search")
            .then(function(response) {
                response = response.data.result;
                def.resolve(response);
            }).catch(function(err) {

                response = "Error";
                console.log(err);
                def.reject();
            });
        return def.promise;
    };
});*/