'use strict';

const Todo = require('../models/todo');
const CrudMongoService = require('../services/crud.mongo.service');

const todoService = CrudMongoService(Todo);

module.exports = todoService;

