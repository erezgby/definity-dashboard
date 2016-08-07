(function(){

    angular
        .module('app')
        .controller('TimeFrameController', [
            'timeFrameService',
            TimeFrameController
        ]);

    function TimeFrameController(timeFrameService) {
        var vm = this;
        vm.updateData = updateData;
        vm.startDate = timeFrameService.getDates().startDate;
        vm.endDate = timeFrameService.getDates().endDate;

        function updateData () {
            if ((timeFrameService.getDates().startDate != vm.startDate)
                || (timeFrameService.getDates().endDate != vm.endDate)) {
                timeFrameService.setDates({
                    startDate: vm.startDate,
                    endDate: vm.endDate
                });
                timeFrameService.notifyObservers();
            }
        }
    }
})();
