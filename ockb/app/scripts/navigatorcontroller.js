'use strict';

angular.module('ockbApp').controller('navigatorcontroller', function ($scope, $http, $q, $location, $timeout, docTypesFactory, navDetailFactory, CONFIG) {

    var vm = this;
    vm.isOCKBEmpty = false;

    $scope.dataForTheTree = [];
    // tree options
    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: false,
        allowDeselect: false,
            injectClasses: {
//                ul: "a1",
                li: "list-group-item",
                liSelected: "ockb-custom-selected",
                iExpanded: "icon expand-icon glyphicon glyphicon-minus",
                iCollapsed: "icon expand-icon glyphicon glyphicon-plus"
//                iLeaf: "a5",
//                label: "a6",
//                labelSelected: "a8"
            }
    };


    vm.get_type = function() {

        var defered = $q.defer();

        $http({
                url: '/api/types/names',
                method: 'GET'
             }).then(function (data) {
                defered.resolve(data);
             }).catch(function (data) {
                defered.reject(data);
             });
        return defered.promise;
    };


    vm.get_ids = function(type) {
        var defered = $q.defer();

        var query = {"query": type };

        $http({
                url: '/api/types/ids',
                method: 'POST',
                data: query
             }).then(function (result) {
                defered.resolve(result.data.hits.hits);
             }).catch(function (result) {
                defered.reject(result);
             });
         return defered.promise;
    };


    vm.sortByDescription = function(a, b){
        if(a.description < b.description){
            return -1;
        }else if(a.description > b.description){
            return 1;
        }else{
            return 0;
        }
    }


    vm.initialTree = function(){
        var promise = vm.get_type();

        promise.then(function(data) {
                 if(data.data.status !== 404){
                     vm.types = data.data.occikb.mappings;
                     var tmpTypes = [];

                     angular.forEach(vm.types, function(value, key) {
                        tmpTypes.push(key);

                        var get_id_promise = vm.get_ids(key);
                        get_id_promise.then(function(data) {

                                 var item = {
//                                    "id": key,
//                                    "type": key,
                                    // here key is the type name, set to description for show
                                    "description": key,
                                    "children": []
                                 };
                                 angular.forEach(data, function(value) {
                                    var tmp = value._source;
                                    tmp.children = [];
                                    tmp.id = value._source.id;
                                    tmp.type = value._source.type;
                                    tmp.description = value._source.description;
                                    item.children.push(tmp);
                                 });
                                 $scope.dataForTheTree.push(item);
                                 // sort the nav tree types
                                 $scope.dataForTheTree.sort(vm.sortByDescription);

                             }, function(data) {
                                 vm.header_titles = [];
                                 console.log("Error when get the ids!");
                             });
                     });
                     // set the doc types to the service, then other controller can use
                     docTypesFactory._setTypes(tmpTypes);
                     // set for the create modal, because we set the add controller as navigator controller's child
                     $scope.tagsSearch = [];
                     angular.forEach(tmpTypes, function(value, key) {
                          $scope.tagsSearch.push({ "text": value });
                     });
                 } else {
                     vm.isOCKBEmpty = true;
                 }
             }, function(data) {
                 vm.types = {error: 'can not find'};
        });
    };


    vm.initialTree();


    $scope.showSelected = function(sel) {
        $scope.selected = sel.name;
        $location.path('detail/' + sel.type + '/' + sel.id);
    };


   // search section is in the main page so add the click search function in this js
    vm.search = function() {
        $location.path('search/'+ vm.searchContent);
    };


    $timeout(function () {
         var typeAndId = navDetailFactory._getDetails();
         var treecontrol = angular.element("treecontrol");
         var firstChildNode = treecontrol.find("#" + typeAndId.type + '_' + typeAndId.type);
         var secondChildNode = treecontrol.find("#" + typeAndId.type + '_' + typeAndId.id);

         if (secondChildNode.length === 0) {
             $timeout(function () {
                 firstChildNode.trigger('click');
             }, 100);

             $timeout(function () {
                 // find again because first node just expanded
                 treecontrol.find("#" + typeAndId.type + '_' + typeAndId.id).trigger('click');
             }, 100);
         } else {
             $timeout(function () {
                 secondChildNode.trigger('click');
             }, 100);
         }
    }, 500);


});
