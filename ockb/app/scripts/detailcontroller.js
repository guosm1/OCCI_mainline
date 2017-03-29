'use strict';
function detailcontroller($scope, $http, $routeParams, $q, CONFIG) {

    $scope.internalUse = CONFIG.internalUse;

    $scope.list = function() {

        var defered = $q.defer();
        var url = CONFIG.protocol + "://" + CONFIG.esHostname + ":" + CONFIG.esPort + "/"
                                + CONFIG.esIndex + "/" + $routeParams.type + '/' + $routeParams.id;
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