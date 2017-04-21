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
             $scope.editContent = {};
             $scope.editContent.id = data.data._source.id;
             $scope.editContent.type = data.data._source.type;
             $scope.editContent.description = data.data._source.description;
             $scope.editContent.explanation = data.data._source.explanation;
             $scope.editContent.level = data.data._source.level;
             $scope.editContent.impact = data.data._source.impact;
             $scope.editContent.reference = data.data._source.reference;


             $scope.editContent.possible_cause = '';
             angular.forEach(data.data._source.possible_cause, function(value) {
                $scope.editContent.possible_cause = $scope.editContent.possible_cause + '"' + value.toString() + '",';
             });
             $scope.editContent.possible_cause = '[' + $scope.editContent.possible_cause.slice(0, -1) + ']';


             $scope.editContent.processing_step = '';
             angular.forEach(data.data._source.processing_step, function(value) {
                $scope.editContent.processing_step = $scope.editContent.processing_step + '"' + value.toString() + '",';
             });
             $scope.editContent.processing_step = '[' + $scope.editContent.processing_step.slice(0, -1) + ']';
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


    $scope.update = function() {

        var defered = $q.defer();

        var editBody = {
                            "id": $scope.editContent.id,
                            "type": $scope.editContent.type,
                            "description": $scope.editContent.description,
                            "explanation": $scope.editContent.explanation,
                            "level": $scope.editContent.level,
                            "impact": $scope.editContent.impact,
                            "possible_cause": $scope.editContent.possible_cause.slice(1,-1).split(","),
                            "processing_step": $scope.editContent.processing_step.slice(1,-1).split(","),
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
