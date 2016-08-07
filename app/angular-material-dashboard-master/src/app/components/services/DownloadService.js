(function(){
    'use strict';

    angular.module('app')
        .service('downloadService', [
            downloadService
        ]);

    function downloadService(){

        var downloadFile = function(name, type, data) {
            var anchor = angular.element('<a/>');
            anchor.css({display: 'none'});
            angular.element(document.body).append(anchor);

            anchor.attr({
                href: 'data:attachment/' + type + ';charset=utf-8,' + encodeURI(data),
                target: '_blank',
                download: name
            })[0].click();

            anchor.remove();
        };

        return {
            downloadFile : downloadFile
        };
    }
})();
