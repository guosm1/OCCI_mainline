'use strict';

function detailcontroller($scope, $http, $routeParams, $q, $timeout, docTypesFactory, CONFIG) {

    $scope.internalUse = CONFIG.internalUse;
    $scope.editTypesSelectOption = docTypesFactory._getTypes();
    $scope.editFailed = false;
    $scope.editFailedMessages = "";
    $scope.editSuccessfully = false;
    $scope.editSuccessfullyMessages = "";

    // set the type and id into the details scope
    $scope.type = $routeParams.type;
    $scope.id = $routeParams.id;


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


    $timeout(function () {
         var treecontrol = angular.element("treecontrol");
         var firstChildNode = treecontrol.find("#" + $scope.type + '_' + $scope.type);
         var secondChildNode = treecontrol.find("#" + $scope.type + '_' + $scope.id);

         if (secondChildNode.length === 0) {
             $timeout(function () {
                 firstChildNode.trigger('click');
             }, 100);

             $timeout(function () {
                 // find again becase first node just expanded
                 treecontrol.find("#" + $scope.type + '_' + $scope.id).trigger('click');
             }, 100);
         } else {
             $timeout(function () {
                 secondChildNode.trigger('click');
             }, 100);
         }
    }, 500);


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
