function addcontroller($scope, $http, $routeParams, $q, $location, docTypesFactory) {

    var addVm  = this;
    $scope.addMessages = "";
    $scope.addContentResponse = false;
    // get the types from navigator types
    $scope.addTypesSelectOption = docTypesFactory._getTypes();


    addVm.getDoc = function() {

        var defered = $q.defer();
        var url = 'http://36.110.131.101:9200/occikb/' + $scope.addContent.type + '/' + $scope.addContent.id;
        $http({
                url: url,
                method: 'GET'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                // when hit error, not reject, resolve the error to the checker
                defered.resolve(data);
             });
        return defered.promise;
    };


    addVm.create = function() {

        var defered = $q.defer();
        var url = 'http://36.110.131.101:9200/occikb/'  + $scope.addContent.type + '/' + $scope.addContent.id;
        var addBody = '{' +
                            '"id": "' + $scope.addContent.id + '",' +
                            '"type": "' + $scope.addContent.type + '",' +
                            '"description": "' + $scope.addContent.description + '",' +
                            '"explanation": "' + $scope.addContent.explanation + '",' +
                            '"level": "' + $scope.addContent.level + '",' +
                            '"impact": "' + $scope.addContent.impact + '",' +
                            '"possible_cause": ' + $scope.addContent.possible_cause + ',' +
                            '"processing_step": ' + $scope.addContent.processing_step + ',' +
                            '"reference": "' + $scope.addContent.reference + '"' +
                        '}';
         $http({
                 url: url,
                 method: 'PUT',
                 data: addBody
              }).then(function (data) {
                 defered.resolve(data.data.created);
              }).catch(function (data) {
                 defered.reject(false);
              });
          return defered.promise;
    };




    $scope.saveAddContent = function() {

        var promise = addVm.getDoc();

        promise.then(function(data) {
                 $scope.checkAddContentFound = data.data.found;

                 if ($scope.checkAddContentFound){
                     $scope.addMessages = "can not create, because the doc is existed!";

                 } else {
                      var addPromise = addVm.create();
                      addPromise.then(function(data) {
                               $scope.addMessages = "create successfully!";
                           }, function(data) {
                               $scope.addMessages = "can not create, please check the input!";
                           });

                 }
             }, function(data) {
                 $scope.addContentFound = {error: 'can not find'};
             });
    };

    $scope.cancelAddContent = function() {
        $location.path("search");
    };

}