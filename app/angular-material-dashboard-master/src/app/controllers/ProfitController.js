(function () {
    angular
        .module('app')
        .controller('ProfitController', [
            'campaignsService',
            'timeFrameService',
            ProfitController
        ]);

    function ProfitController(campaignsService, timeFrameService) {
        var vm = this;
        vm.visitorsChartData = [];

        function update() {
            campaignsService
                .getProfit()
                .then(function (profitData) {
                    profitData = profitData || {};
                    vm.profitChartData = [{key: 'Cost', y: profitData.totalCost},
                        {key: 'Revenue', y: profitData.totalRevenue}];
                    vm.profit = profitData.totalProfit;
                });
        }

        vm.chartOptions = {
            chart: {
                type: 'pieChart',
                height: 210,
                donut: true,
                x: function (d) { return d.key; },
                y: function (d) { return d.y; },
                valueFormat: (d3.format(".0f")),
                color: ['#E75753', 'rgb(0, 150, 136)'],
                showLabels: false,
                showLegend: false,
                title: 'Rev:Cost',
                margin: { top: -10 }
            }
        };

        timeFrameService.registerObserverCallback(update);
        update();
    }
})();
