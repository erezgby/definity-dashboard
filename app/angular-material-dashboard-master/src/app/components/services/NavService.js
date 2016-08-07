(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'Dashboard',
        icon: 'dashboard',
        sref: '.dashboard'
      },
      // {
      //   name: 'Profile',
      //   icon: 'person',
      //   sref: '.profile'
      // },
      {
        name: 'CSV',
        icon: 'view_list',
        sref: '.csv'
      },
      {
        name: 'Table',
        icon: 'view_module',
        sref: '.campaigns'
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
