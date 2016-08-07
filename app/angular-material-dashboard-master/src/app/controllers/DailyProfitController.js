(function () {
    angular
        .module('app')
        .controller('DailyProfitController', [
            'campaignsService',
            'timeFrameService',
            DailyProfitController
        ]);

    function DailyProfitController(campaignsService, timeFrameService) {
        var vm = this;
        
        function update() {
            var profitsData;
            campaignsService
                .getCampaignsProfit()
                .then(function (campaignsData) {
                    profitsData = campaignsData.map(function (campaign, i) {
                        return {x: i, y: campaign.totalProfit};
                    });
                    vm.dailyProfitChartData = [{values: profitsData, color: 'rgb(0, 150, 136)', area: true}];
                });
        }

        vm.chartOptions = {
            chart: {
                type: 'lineChart',
                height: 210,
                margin: { top: -10, left: -20, right: -20 },
                x: function (d) { return d.x },
                y: function (d) { return d.y },
                showLabels: false,
                showLegend: false,
                showYAxis: false,
                showXAxis: false,
                tooltip: { contentGenerator: function (d) { return '<span class="custom-tooltip">' + Math.round(d.point.y) + '</span>' } }
            }
        };

        timeFrameService.registerObserverCallback(update);
        update();
    }
})();
