'use strict';

/**
 * Wraps a functions such that when it's called it returns an promise
 * that is resolved with a value that contains the original data
 * that this function received in addition any data that was calculated by
 * the function.
 *
 * The best way to understand this is to look at the using tests in 'test-wrap-step.js'.
 */
module.exports = func =>
    originalData =>
        Promise.resolve(originalData)
            .then(func)
            .then(newData =>
                Promise.resolve(Object.freeze(Object.assign({}, originalData, newData))));
