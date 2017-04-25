'use strict';

angular.module('ockbApp').controller('addcontroller', function ($scope, $http, $q, $location, docTypesFactory, CONFIG) {

    $scope.addFailed = false;
    $scope.addFailedMessages = "";
    $scope.addSuccessfully = false;
    $scope.addSuccessfullyMessages = "";
    $scope.addContentResponse = false;
    $scope.addContent = {};

    $scope.reasons = [{key: 0, value: ""}];
    $scope.steps = [{key: 0, value: ""}];

    $scope.tags = [];


    $scope.loadTags = function(query) {
      return $scope.tagsSearch;
    };


    // only permit the one tag
    $scope.forceOneTag = function(tags) {
        return (tags.length === 0);
    }


    $scope.incReason = function($index) {
          $scope.reasons.splice($index + 1, 0, {key: new Date().getTime(), value: ""});
    }


    $scope.rmvReason = function($index) {
          $scope.reasons.splice($index, 1);
    }


    $scope.incStep = function($index) {
          $scope.steps.splice($index + 1, 0, {key: new Date().getTime(), value: ""});
    }


    $scope.rmvStep = function($index) {
          $scope.steps.splice($index, 1);
    }


    $scope.formatListToEs = function(array) {
          var formatted = [];
          angular.forEach(array, function(obj, key) {
              formatted.push(obj.value);
          });
          return formatted;
    }


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
        var possible_cause = $scope.formatListToEs($scope.reasons);
        var processing_step = $scope.formatListToEs($scope.steps);
        // because we only allow 1 component in this field, only get the first index 0 data
        var type = $scope.tags[0].text;

        var defered = $q.defer();

        var addBody = {
                            "id": $scope.addContent.id,
                            "type": type,
                            "description": $scope.addContent.description,
                            "explanation": $scope.addContent.explanation,
                            "level": $scope.addContent.level,
                            "impact": $scope.addContent.impact,
                            "possible_cause": possible_cause,
                            "processing_step": processing_step,
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

