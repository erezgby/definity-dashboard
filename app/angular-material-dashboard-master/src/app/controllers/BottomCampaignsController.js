(function () {
    angular
        .module('app')
        .controller('BottomCampaignsController', [
            'campaignsService',
            'timeFrameService',
            BottomCampaignsController
        ]);

    // TODO: Merge with TopCampaignsController into one controller and one directive
    function BottomCampaignsController(campaignsService, timeFrameService) {
        var vm = this;
        
        function update() {
            var profitsData;
            campaignsService
                .getSortedCampaignsProfit({campaignsNumber: 5})
                .then(function (campaignsData) {
                    profitsData = campaignsData.map(function (campaign) {
                        return {x: campaign._id, y: campaign.totalProfit};
                    });
                    vm.campaignsChartData = [{values: profitsData, area: true}];
                });
        }

        vm.chartOptions = {
            chart: {
                type: 'discreteBarChart',
                height: 210,
                margin: { top: -10, left: -20, right: -20 },
                x: function (d) { return d.x },
                y: function (d) { return d.y },
                color: ['rgb(0, 150, 136)', 'rgb(191, 191, 191)','#E75753',
                    'rgb(149, 149, 149)', 'rgb(117, 117, 117)'],
                showLabels: false,
                showLegend: false,
                showYAxis: false,
                showXAxis: false
            }
        };

        timeFrameService.registerObserverCallback(update);
        update();
    }
})();
