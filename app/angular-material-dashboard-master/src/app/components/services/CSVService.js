(function(){
    'use strict';

    angular.module('app')
        .service('csvService', [
            'timeFrameService', '$http', 'config',
            csvService
        ]);

    function csvService(timeFrameService, $http, config){
        var baseURL = config.serverURL + 'csv';

        var _getDatesURL = function() {
            var qsParams = [];
            var datesObject = timeFrameService.getDates();
            for (var prop in datesObject) {
                if (datesObject.hasOwnProperty(prop)) {
                    qsParams.push(prop + '=' + datesObject[prop].toISOString().slice(0, 10));
                }
            }
            return ("?" + qsParams.join("&"));
        };

        var getCSV = function(sheet) {
            return $http.get(baseURL + _getDatesURL() + "&modelName=" + sheet).then(function (response) {
                return response.data;
            });
        };
        
        var getFileName = function(sheet) {
            return sheet + '-data-' + timeFrameService.getDates().startDate.toISOString().slice(0, 10)
                + '--' + timeFrameService.getDates().endDate.toISOString().slice(0, 10) + '.csv';
        };

        return {
            getCSV : getCSV,
            getFileName: getFileName
        };
    }
})();
