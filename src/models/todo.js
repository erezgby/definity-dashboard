'use strict';

var mongoose = require('mongoose');

// todo.text
// todo.done

var todoSchema = new mongoose.Schema({
	text: String,
	done: Boolean
});

var model = mongoose.model('Todo', todoSchema);

module.exports = model;
