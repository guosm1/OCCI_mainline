function detailcontroller($scope, $http, $routeParams, $q) {


    $scope.list = function() {

        var defered = $q.defer();
        var url = 'http://36.110.131.101:9200/occikb/' + $routeParams.type + '/' + $routeParams.id;
        $http({
                url: url,
                method: 'GET'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                defered.reject(data);
             });
        return defered.promise;
    };

    var promise = $scope.list();

    promise.then(function(data) {
             $scope.detail = data.data;
         }, function(data) {
             $scope.detail = {error: 'can not find'};
         });


}