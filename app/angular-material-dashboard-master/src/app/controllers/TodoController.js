(function () {
    angular
        .module('app')
        .controller('TodoController', [
            'todoListService',
            TodoController
        ]);

    function TodoController(todoListService) {
        var vm = this;

        vm.addTodo = addTodo;
        vm.remaining = remaining;
        vm.archive = archive;
        vm.toggleAll = toggleAll;
        vm.todos = [];

        todoListService
            .getTodos()
            .then(function (todos) {
                vm.todos = [].concat(todos.data);
            });

        function addTodo() {
            if (!vm.todoText) return;
            var todo = {text: vm.todoText, done: false};
            todoListService.addTodo(todo)
                .then(function(){
                    vm.todos.push(todo);
                    vm.todoText = '';
                });
        }

        function remaining() {
            var count = 0;
            angular.forEach(vm.todos, function (todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        }

        function archive(e) {
            // Prevent from submitting
            e.preventDefault();
            var oldTodos = vm.todos;
            var deleted = [];
            vm.todos = [];
            angular.forEach(oldTodos, function (todo) {
                if (!todo.done) {
                    vm.todos.push(todo)
                } else {
                    deleted.push(todo);
                }
            });
            todoListService.deleteTodos(deleted);
        }

        function toggleAll() {
            if (remaining() == 0) {
                angular.forEach(vm.todos, function (todo) {
                    todo.done = false;
                });
            } else {
                angular.forEach(vm.todos, function (todo) {
                    todo.done = true;
                });
            }
        }

    }
})();
