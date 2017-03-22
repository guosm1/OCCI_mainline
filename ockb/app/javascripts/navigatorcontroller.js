angular.module('ockbApp').controller('navigatorcontroller', function ($scope, $http, $q, docTypesFactory) {

    var vm = this;
    vm.header_titles = [];
    vm.expand = false;
    vm.expandType = "";

    vm.get_type = function() {

        var defered = $q.defer();
        var url = 'http://36.110.131.101:9200/occikb/';
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


    vm.get_ids = function(type) {
        var defered = $q.defer();
        var query = '{' +
                        '"size": 10000,' +
                        '"sort" : [' +
                            '{"id" : "asc"}' +
                        '],' +
                        '"query" : {' +
                            '"term" : { "_type" :"' +  type + '"}' +
                        '}' +
                     '}';
        $http({
                url: 'http://36.110.131.101:9200/occikb/_search',
                method: 'POST',
                data: query
             }).then(function (result) {
                defered.resolve(result.data.hits.hits);
             }).catch(function (result) {
                defered.reject(result);
             });
         return defered.promise;
    };


    var promise = vm.get_type();

    promise.then(function(data) {
             vm.types = data.data.occikb.mappings;
             var tmpTypes = [];
             angular.forEach(vm.types, function(value, key) {
                tmpTypes.push(key);

                var get_id_promise = vm.get_ids(key);
                get_id_promise.then(function(data) {
                         var item = {"type": key, "type_ids": data};
                         vm.header_titles.push(item);
                     }, function(data) {
                         vm.header_titles = [];
                         console.log("Error when get the ids!");
                     });
             });
             // set the doc types to the service, then other controller can use
             docTypesFactory._setTypes(tmpTypes);

         }, function(data) {
             vm.types = {error: 'can not find'};
         });


    vm.expandFunc = function (type) {
        var subLiElements = angular.element("." + type);
        if (subLiElements.length != 0 ){
            if(subLiElements[0].className == type){
                angular.forEach(subLiElements, function(value, key) {
                    value.className = "hidden " + type;
                });
            } else{
                angular.forEach(subLiElements, function(value, key) {
                    value.className = type;
                });
            }
        }
    };



});