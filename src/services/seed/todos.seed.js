'use strict';

const Todo = require('../../models/todo');

const todos = [
	'Close RevContent Pokemon campaign',
	'Open new campaign in Outbrain',
	'Check whether Fat Celebs campaign is still profitable'
];

todos.forEach(function (todo) {
  Todo.find({ 'text': todo }, function(err, todos) {
  	if (!err && !todos.length) {
      Todo.create({ done: false, text: todo });
  	}
  });
});
