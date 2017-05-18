'use strict';
var configApp = angular.module('ockbConfigApp', []);

configApp.constant('CONFIG', {
                        "internalUse": false,
                        // the levels for the problem level in the create and edit modal
                        "levels": ["INFO", "WARN", "ERROR", "FATAL"],
                        // the public information for the public or not in the create and edit modal
                        "public": ["PUBLIC", "PRIVATE"]
                    }
                  );
