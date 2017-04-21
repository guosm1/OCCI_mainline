'use strict';

angular.module('ockbApp').controller('addcontroller', function ($scope, $http, $q, $location, docTypesFactory, CONFIG) {

    $scope.addFailed = false;
    $scope.addFailedMessages = "";
    $scope.addSuccessfully = false;
    $scope.addSuccessfullyMessages = "";
    $scope.addContentResponse = false;
    $scope.addContent = {};


    $scope.getDoc = function() {

        var defered = $q.defer();

        var url = '/api/details/' + $scope.addContent.type + '/' + $scope.addContent.id;
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


    $scope.create = function() {

        var defered = $q.defer();

        var addBody = {
                            "id": $scope.addContent.id,
                            "type": $scope.addContent.type,
                            "description": $scope.addContent.description,
                            "explanation": $scope.addContent.explanation,
                            "level": $scope.addContent.level,
                            "impact": $scope.addContent.impact,
                            "possible_cause": $scope.addContent.possible_cause.slice(1,-1).split(","),
                            "processing_step": $scope.addContent.processing_step.slice(1,-1).split(","),
                            "reference": $scope.addContent.reference,
                       };
         $http({
                 url: '/api/add/',
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

        var promise = $scope.getDoc();

        promise.then(function(data) {
                 $scope.checkAddContentFound = data.data.found;

                 if ($scope.checkAddContentFound){
                     $scope.addFailed = false;
                     $scope.addFailedMessages = "can not create, because the doc is existed!";

                 } else {
                      var addPromise = $scope.create();
                      addPromise.then(function(data) {
                               $scope.addMessages = "create successfully!";
                           }, function(data) {
                               $scope.addFailed = false;
                               $scope.addFailedMessages = "can not create, please check the input!";
                           }).then(function(){
                                  $location.path('detail/' + $scope.addContent.type + '/' + $scope.addContent.id);
                                  // refresh the whole page after the delete, but it need to enhance partial refresh
                                  window.location.reload();
                           });
                 }
             }, function(data) {
                 $scope.addContentFound = data;
             });
    };

    $scope.cancelAddContent = function() {
        $location.path("search");
    };

});

