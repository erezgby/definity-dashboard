(function () {
    angular
        .module('app')
        .controller('CSVController', [
            'csvService', 'downloadService', '$timeout',
            CSVController
        ]);

    function CSVController(csvService, downloadService, $timeout) {
        var vm = this;
        vm.getCSV = getCSV;
        vm.isWaiting = {};

        function _fakeProgress (sheet) {
                console.log(vm.determinateValue);
            $timeout(function(){
                vm.determinateValue += (100 - vm.determinateValue)/4;
                if (!vm.isWaiting[sheet]) {
                    return;
                }
                _fakeProgress(sheet);
            }, 250);
        }
        
        function getCSV (sheet) {
            vm.downloadFailed = false;
            vm.isWaiting[sheet] = true;
            vm.determinateValue = 0;
            _fakeProgress(sheet);
            csvService.getCSV(sheet)
                .then(function(data) {
                    downloadService.downloadFile(csvService.getFileName(sheet), 'csv', data);
                    vm.isWaiting[sheet] = false;
                })
                .catch(function() {
                    vm.isWaiting[sheet] = false;
                    vm.downloadFailed = true;
                });
        }
    }

})();
