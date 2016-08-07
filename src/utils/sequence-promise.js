'use strict';
const Promise = require('bluebird');

// Source: https://github.com/petkaantonov/bluebird/issues/70

// Waterfall
function waterfall(tasks) {
    var current = Promise.cast();
    for (var k = 0; k < tasks.length; ++k) {
        current = current.then(tasks[k]);
    }
    return current;
}

// Sequence without passing (waterfalling) results to the next item
function dependentWaterfall(tasks) {
    var current = Promise.cast();
    for (var k = 0; k < tasks.length; ++k) {
        current = current.thenReturn().then(tasks[k]);
    }
    return current.thenReturn();
}

// Waterfall but returning all results instead of the last one
function multipleResultsWaterfall(tasks) {
    var current = Promise.cast(), results = [];
    for (var k = 0; k < tasks.length; ++k) {
        results.push(current = current.then(tasks[k]));
    }
    return Promise.all(results);
}

// Sequence without waterfalling, returning all results:
function multipleResultsDependentWaterfall(tasks) {
    var current = Promise.cast(), results = [];
    for (var k = 0; k < tasks.length; ++k) {
        results.push(current = current.thenReturn().then(tasks[k]));
    }
    return Promise.all(results);
}

const service = {};
service.waterfall = waterfall;
service.dependentWaterfall = dependentWaterfall;
service.multipleResultsWaterfall = multipleResultsWaterfall;
service.multipleResultsDependentWaterfall = multipleResultsDependentWaterfall;

module.exports = service;