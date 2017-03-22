function deletecontroller($scope, $http, $routeParams, $q) {

    var deleteVm  = this;

    deleteVm.deleteDoc = function() {

        var defered = $q.defer();
        var url = 'http://36.110.131.101:9200/occikb/' + $routeParams.type + '/' + $routeParams.id;
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