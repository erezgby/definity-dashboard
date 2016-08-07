(function(){
    'use strict';

    angular.module('app')
        .service('timeFrameService', [
            TimeFrameService
        ]);

    function TimeFrameService(){
        var today = new Date();
        var startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
        var endDate = today;
        var observerCallbacks = [];

        function getDates() {
            return {
                startDate: startDate,
                endDate: endDate
            }
        }
        
        function setDates(dates) {
            startDate = dates.startDate;
            endDate = dates.endDate;
        }

        function registerObserverCallback (callback){
            observerCallbacks.push(callback);
        }

        function notifyObservers (){
            angular.forEach(observerCallbacks, function(callback){
                callback();
            });
        }

        return {
            getDates: getDates,
            setDates: setDates,
            registerObserverCallback: registerObserverCallback,
            notifyObservers: notifyObservers
        };
    }
})();
