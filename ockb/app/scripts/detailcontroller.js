'use strict';

function detailcontroller($scope, $http, $routeParams, $q, docTypesFactory, navDetailFactory, CONFIG) {

    $scope.internalUse = CONFIG.internalUse;
    $scope.editTypesSelectOption = docTypesFactory._getTypes();
    $scope.editFailed = false;
    $scope.editFailedMessages = "";
    $scope.editSuccessfully = false;
    $scope.editSuccessfullyMessages = "";

    // set the type and id into the details scope
    $scope.type = $routeParams.type;
    $scope.id = $routeParams.id;

    // set the type and id to the nav and details services
    navDetailFactory._setDetails({
        "type": $scope.type,
        "id": $scope.id
    });


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



    $scope.list = function() {

        var defered = $q.defer();
        var url = '/api/details/' + $scope.type + '/' + $scope.id;
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


    $scope.setEditContent = function(data) {
             $scope.reasons = [];
             $scope.steps = [];
             $scope.editContent = {};
             $scope.editContent.id = data.data._source.id;
             $scope.editContent.type = data.data._source.type;
             $scope.editContent.description = data.data._source.description;
             $scope.editContent.explanation = data.data._source.explanation;
             $scope.editContent.level = data.data._source.level;
             $scope.editContent.impact = data.data._source.impact;
             $scope.editContent.reference = data.data._source.reference;



             angular.forEach(data.data._source.possible_cause, function(value) {
                  $scope.reasons.push({key: new Date().getTime(), value: value});
             });


             angular.forEach(data.data._source.processing_step, function(value) {
                  $scope.steps.push({key: new Date().getTime(), value: value});
             });
    }


    var promise = $scope.list();

    promise.then(function(data) {
             $scope.detail = data.data;
             $scope.setEditContent(data);
         }, function(data) {
             $scope.detail = {error: 'can not find'};
    });


    $scope.formatListToEs = function(array) {
          var formatted = [];
          angular.forEach(array, function(obj, key) {
              formatted.push(obj.value);
          });
          return formatted;
    }


    $scope.update = function() {
        var possible_cause = $scope.formatListToEs($scope.reasons);
        var processing_step = $scope.formatListToEs($scope.steps);

        var defered = $q.defer();

        var editBody = {
                            "id": $scope.editContent.id,
                            "type": $scope.editContent.type,
                            "description": $scope.editContent.description,
                            "explanation": $scope.editContent.explanation,
                            "level": $scope.editContent.level,
                            "impact": $scope.editContent.impact,
                            "possible_cause": possible_cause,
                            "processing_step": processing_step,
                            "reference": $scope.editContent.reference,
                       };
         $http({
                 url: '/api/edit/',
                 method: 'PUT',
                 data: editBody
              }).then(function (data) {
                 defered.resolve(data.status);
              }).catch(function (data) {
                 defered.reject(data.status);
              });
          return defered.promise;
    };


    $scope.refresh = function() {
       var promise = $scope.list();
       promise.then(function(data) {
                $scope.detail = data.data;
                $scope.setEditContent(data);
            }, function(data) {
                $scope.detail = {error: 'can not find'};
            });

    }


    $scope.saveEditContent = function() {
        var editPromise = $scope.update();
        editPromise.then(function(data) {
                 $scope.editSuccessfullyMessages = "Edit successfully!";
                 $scope.editSuccessfully = true;
                 $scope.refresh();
             }, function(data) {
                 $scope.editMessages = "can not edit the doc info hit the error: " + data;
        });

        $('#editModal').modal('hide')
    };


}
