(function () {
    angular
        .module('app')
        .controller('DeviceProfitController', [
            'campaignsService',
            'timeFrameService',
            DeviceProfitController
        ]);

    function DeviceProfitController(campaignsService, timeFrameService) {
        var vm = this;

        function update() {
            var profitsData;
            campaignsService
                .getDeviceProfits()
                .then(function (campaignsData) {
                    profitsData = campaignsData.map(function (deviceData) {
                        return {key: deviceData._id, y: deviceData.totalProfit};
                    });
                    vm.deviceChartData = profitsData;
                });
        }

        vm.chartOptions = {
            chart: {
                type: 'pieChart',
                height: 210,
                donut: true,
                pie: {
                    startAngle: function (d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function (d) { return d.endAngle/2 -Math.PI/2 }
                },
                x: function (d) { return d.key; },
                y: function (d) { return d.y; },
                valueFormat: (d3.format(".0f")),
                color: ['#E75753', 'rgb(0, 150, 136)', 'rgb(191, 191, 191)'],
                showLabels: true,
                showLegend: false,
                tooltips: false,
                title: 'Devices',
                titleOffset: -10,
                margin: { bottom: -80, left: -20, right: -20 }
            }
        };

        timeFrameService.registerObserverCallback(update);
        update();
    }
})();
