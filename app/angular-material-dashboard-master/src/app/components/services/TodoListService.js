(function(){
  'use strict';

  angular.module('app')
        .service('todoListService', [
        '$http', '$q', 'config',
      todoList
  ]);

  function todoList($http, $q, config){

    var baseURL = config.serverURL + 'todo/';

    function getTodos() {
      return $http.get(baseURL);
    }

    function deleteTodos(todos) {
      var queue = [];
      todos.forEach(function(todo) {
        if (todo._id) {
          queue.push($http.delete(baseURL + todo._id));
        }
      });
      return $q.all(queue);
    }
    
    function addTodo(todo) {
      return $http.post(baseURL, todo);
    }

    return {
      getTodos: getTodos,
      deleteTodos: deleteTodos,
      addTodo: addTodo
    };
  }
})();
