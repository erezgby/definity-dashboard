'use strict';

angular.module('app')
    .directive('downloadCsv', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: { topic: '@', template: '@', options: '@' },
            controller: 'CSVController',
            controllerAs: 'vm',
            template: '' +
            '<md-content layout="column" layout-align="center center">' +
            '   <md-button ng-click="vm.getCSV(topic)">' +
            '       <h3>Donwload CSV</h3>' +
            '       <i class="material-icons">file_download</i>' +
            '   </md-button>' +
            '   <md-progress-linear class="linearProgress" ng-show="vm.isWaiting[topic]"' +
            '       md-mode="determinate" value="{{vm.determinateValue}}"></md-progress-linear>' +
            '   <h5 class="downloadFailed" ng-show="vm.downloadFailed">Creating File Failed</h5>' +
            '</md-content>'
            ,
            compile: function(element, attrs, linker) {
                return function(scope, element) {
                    linker(scope, function(clone) {
                        element.append(clone);
                    });
                };
            }
        };
    });
