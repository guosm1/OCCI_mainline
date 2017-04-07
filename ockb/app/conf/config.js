'use strict';
var configApp = angular.module('ockbConfigApp', []);

configApp.constant('CONFIG', {
                        "protocol": "http",
                        "esHostname": "localhost",
                        "esPort": "9200",
                        "esIndex": "occikb",
                        "internalUse": false
                    }
                  );
