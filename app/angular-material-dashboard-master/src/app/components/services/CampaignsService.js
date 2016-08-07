(function(){
  'use strict';

  angular.module('app')
        .service('campaignsService', [
        'timeFrameService', '$http', 'config',
      campaignsService
  ]);

  function campaignsService(timeFrameService, $http, config){
    var baseURL = config.serverURL + 'profit/';

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
    
    var getCampaignsProfit = function() {
      return $http.get(baseURL + 'campaigns' + _getDatesURL()).then(function (response) {
        return response.data;
      });
    };

    var getSortedCampaignsProfit = function(opts) {
      var opts = opts || {};
      var campaignsNumber = opts.campaignsNumber || 0;
      var descending = opts.descending || false;
      return $http.get(baseURL + 'campaigns' + _getDatesURL()).then(function (response) {
        const sortedCampaigns = response.data.sort(function(a,b){
          var keyA = a.totalProfit;
          var keyB = b.totalProfit;
          if(keyA < keyB && descending) return 1;
          if(keyA > keyB && descending) return -1;
          if(keyA < keyB && !descending) return -1;
          if(keyA > keyB && !descending) return 1;
          return 0;
        });
        if (campaignsNumber > 0) {
          return sortedCampaigns.slice(0, campaignsNumber)
        }
      });
    };


    var getDeviceProfit = function() {
      return $http.get(baseURL + 'device' + _getDatesURL()).then(function (response) {
        return response.data;
      });
    };

    var getProfit = function() {
      return $http.get(baseURL + 'total' + _getDatesURL()).then(function (response) {
        return response.data[0];
      });
    };
    
    var getCampaignsPerformance = function() {
      return $http.get(baseURL + 'performance' + _getDatesURL()).then(function (response) {
        return response.data;
      });
    };

    return {
      getCampaignsPerformance: getCampaignsPerformance,
      getCampaignsProfit : getCampaignsProfit,
      getSortedCampaignsProfit: getSortedCampaignsProfit,
      getDeviceProfits: getDeviceProfit,
      getProfit : getProfit
    };
  }
})();
