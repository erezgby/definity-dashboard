(function(){
  angular
    .module('app')
    .controller('CampaignsController', [
      'campaignsService',
      'timeFrameService',
      CampaignsController
    ]);

  function CampaignsController(campaignsService, timeFrameService) {
    var vm = this;
    vm.sortingOrder='_id';

    function update() {
      vm.tableData = [];
      campaignsService
          .getCampaignsProfit()
          .then(function (tableData) {
            vm.tableData = [].concat(tableData);
          });
    }

    // change sorting order
    vm.sortBy = function(newSortingOrder) {
      if (vm.sortingOrder === newSortingOrder)
        vm.reverse = !vm.reverse;

      vm.sortingOrder = newSortingOrder;
      console.log(vm.reverse);
    };

    vm.getIcon = function(column) {
      if (vm.sortingOrder === column && vm.reverse) {
        return 'arrow_drop_up';
      }
      return 'arrow_drop_down';
    };

    timeFrameService.registerObserverCallback(update);
    update();
  }
  
})();
