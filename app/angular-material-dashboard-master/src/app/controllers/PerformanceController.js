(function () {
    angular
        .module('app')
        .controller('PerformanceController', [
            'campaignsService',
            'timeFrameService',
            PerformanceController
        ]);

    function PerformanceController(campaignsService, timeFrameService) {
        var vm = this;

        function update() {
            var dates = [];
            var performanceData = [];
            var startDate = new Date(timeFrameService.getDates().startDate);
            var endDate = new Date(timeFrameService.getDates().endDate);
            for (var i = 1, d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                dates.push({ idx: i++, date: new Date(d) });
            }
            campaignsService
                .getCampaignsPerformance()
                .then(function (campaignsData) {
                    campaignsData.forEach(function(campaign) {
                        var values = [];
                        var campaignIdx = 0;
                        dates.forEach(function(dateObj) {
                            if (campaign.profits[campaignIdx] && dateObj.date.toISOString().slice(0, 10) ===
                                campaign.profits[campaignIdx].date.slice(0, 10)) {
                                values.push([dateObj.idx, campaign.profits[campaignIdx].totalProfit]);
                                campaignIdx++;
                            } else {
                                values.push([dateObj.idx, 0]);
                            }
                        });
                        performanceData.push({
                            key: campaign._id,
                            values: values
                        })
                    });
                    vm.performanceChartData = performanceData;
                });
        }

        vm.chartOptions = {
            chart: {
                type: 'stackedAreaChart',
                height: 350,
                margin: { left: -15, right: -15 },
                x: function (d) { return d[0] },
                y: function (d) { return d[1] },
                showLabels: false,
                showLegend: false,
                title: 'Over 9K',
                showYAxis: false,
                showXAxis: false,
                color: ['rgb(0, 150, 136)', 'rgb(191, 191, 191)','#E75753',
                    'rgb(149, 149, 149)', 'rgb(117, 117, 117)'],
                tooltip: { contentGenerator: function (d) {
                    return '<div class="custom-tooltip">' + Math.round(d.point.y) +
                        '%</div>' + '<div class="custom-tooltip">' + d.series[0].key + '</div>'
                }},
                showControls: false
            }
        };
        // activate();
        //
        // function activate() {
        //     var queries = [loadData()];
        //     $q.all(queries);
        // }
        //
        //
        // function loadData() {
        //     vm.performanceChartData = performanceService.getPerformanceData(vm.performancePeriod);
        // }

        timeFrameService.registerObserverCallback(update);
        update();
    }
})();
