var app = angular.module('ockbApp', ['datatables', 'ngRoute', 'pascalprecht.translate']);
app.config(function($routeProvider) {
     $routeProvider
         .when(
           '/search/:searchContent', {
               templateUrl: 'views/search.html',
               controller: searchcontroller})
         .when(
           '/detail/:type/:id', {
               templateUrl: 'views/detail.html',
               controller: detailcontroller})
         .when(
           '/add', {
               templateUrl: 'views/add.html',
               controller: addcontroller})
         .when(
           '/edit/:type/:id', {
               templateUrl: 'views/edit.html',
               controller: editcontroller})
         .when(
           '/delete/:type/:id', {
               templateUrl: 'views/delete.html',
               controller: deletecontroller})
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


app.controller('appController', function($scope) {

});

//app.service('getDocDetails', function($http, $routeParams, $q) {
//    this.getDocInfo = function() {
//        var aaa = "";
//        var defered = $q.defer();
//        var url = 'http://103.235.243.213:9200/occikb/' + $routeParams.type + '/' + $routeParams.id;
//        $http({
//                url: url,
//                method: 'GET'
//             }).then(function (data) {
//                defered.resolve(data);
//             }).catch(function (data) {
//                defered.reject(data);
//             });
//
//        defered.promise.then(function(data) {
//
//                                aaa =  data;
//                                        return aaa;
//
//                                }, function(data) {
//                                    aaa =  data;
//                                            return aaa;
//                                });;
//
//
//    };
//
//});
////define the filter for the highlight
//app.filter('highlight', ['$sce', function($sce) {
//    return function(content, searchContent) {
//            content = angular.toJson(content);
////            content = encodeURI(content);
////            searchContent = encodeURI(searchContent);
////            var reg = new RegExp(searchContent, 'gi');
//
//
//
//            content =  content.replace(searchContent, '<a>aaaaaa</a>');
////            content = decodeURI(content);
////            return $sce.trustAsHtml(content);
//              return content;
//        }
//    }]);
//app.controller('maincontroller', function ($scope, $http) {
//
//    $scope.$route = $route;
//    $scope.search = function() {
//        //alert($scope.searchContent);
//        var query = '{' +
//                        //'"track_scores": true,' + { "告警描述" : "desc" }, { "处理步骤" : "desc" },
//                        '"sort" : ["_score"],' +
//                        '"size": 100,' +
//                        '"query": {' +
//                            '"simple_query_string": {' +
//                                '"query": "' + $scope.searchContent + '",' +
//                                '"fields": ["告警描述", "处理步骤"],' +
//                                '"default_operator": "or"' +
//                                '}' +
//                            '}' +
//                        '}';
//
//                                //"告警描述": "' + $scope.searchContent + '"}}}';
//        $http({
//                url: 'http://103.235.243.213:9200/occikb/_search',
//                method: 'POST',
//                data: query
//                //headers: {"Access-Control-Allow-Origin": "*"}
//             }).then(function (result) {
//                $scope.data = result;
//
//                $scope.results = result.data.hits.hits;
//
//
//                var a = "1";
//
//
//             }).catch(function (result) {
//                $scope.data = "";
//             });
//    };
//
//}).config(['$routeProvider', function($routeProvider) {
//  $routeProvider.
//      when(
//        '/search', {
//            templateUrl: 'views/search.html',
//            controller: searchcontroller}).
//      when(
//        '/search/:id', {
//            templateUrl: 'views/detail.html',
//            controller: alertcontroller}).
//      otherwise({redirectTo: '/search'});
//}]);



