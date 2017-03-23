function deletecontroller($scope, $http, $routeParams, $q, CONFIG) {

    var deleteVm  = this;

    deleteVm.deleteDoc = function() {

        var defered = $q.defer();
        var url = CONFIG.protocol + "://" + CONFIG.esHostname + ":" + CONFIG.esPort + "/"
                                + CONFIG.esIndex + "/" + $routeParams.type + '/' + $routeParams.id;
        $http({
                url: url,
                method: 'DELETE'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                defered.reject(data);
             });
        return defered.promise;
    };

    var promise = deleteVm.deleteDoc();

    promise.then(function(data) {
             $scope.deleteMessages = "delete successfully!";
         }, function(data) {
             $scope.deleteMessages = "can not delete, please contact the admin!";
         });

}