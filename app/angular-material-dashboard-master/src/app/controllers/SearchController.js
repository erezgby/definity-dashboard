(function(){

  angular
    .module('app')
    .controller('SearchController', [
      'campaignsService',
      SearchController
    ]);

  function SearchController(campaignsService) {
    var vm = this;

    vm.selectedCampaign = null;
    vm.searchText = null;
    vm.querySearch = querySearch;
    vm.disableCaching = true;

    function querySearch (query) {
      return campaignsService.getCampaignsProfit()
          .then(function(data) {
            var formattedData = data.map(function(campaign) {
              return {
                value: campaign._id.toLowerCase(),
                display: campaign._id,
                totalCost: campaign.totalCost,
                totalRevenue: campaign.totalRevenue,
                totalProfit: campaign.totalProfit,
                costPercentage: (100 * campaign.totalCost) / (campaign.totalCost + campaign.totalRevenue),
                revenuePercentage: (100 * campaign.totalRevenue) / (campaign.totalCost + campaign.totalRevenue),
                profitPercentage: (100 * campaign.totalProfit) / (campaign.totalCost + campaign.totalRevenue)
              }
            });
              return (formattedData.filter(createFilterFor(query)));
          });
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }
})();
