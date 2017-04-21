'use strict';

var app = angular.module('ockbApp', ['datatables', 'ngRoute', 'pascalprecht.translate', 'treeControl', 'ockbConfigApp']);
app.config(function($routeProvider, CONFIG) {

     $routeProvider
         .when(
           '/search/:searchContent', {
               templateUrl: 'views/search.html',
               controller: searchcontroller})
         .when(
           '/detail/:type/:id', {
               templateUrl: 'views/detail.html',
               controller: detailcontroller})

         .otherwise(
            {
                redirectTo: '/search'
            });
   });


app.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
    });
    $translateProvider.preferredLanguage('zh');
    $translateProvider.useSanitizeValueStrategy('escape');
});


// define a service for the types sync in diff controllers
app.factory('docTypesFactory', function() {
    var service = {};
    var types = [];

    service._setTypes = function(typesIn){
        types = typesIn;
    };
    service._getTypes = function() {
        return types;
    };

    return service;
});


app.controller('appController', function($scope, CONFIG) {
    $scope.internalUse = CONFIG.internalUse;
});
