'use strict';

const wrapStep = require('./wrap-step');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

describe('wrap-step', () => {
    it('Should resolve resolved promises and enrich the data returned from them', () => {
        const func = (data) => Promise.resolve({hello: 'world', b: data.a + 1});
        const wrapped = wrapStep(func);
        const expected = {a: 1, b: 2, hello: 'world'};
        return assert.eventually.deepEqual(wrapped({a: 1}), expected);
    });

    it('Should not catch rejected promises', (done) => {
        const func = (data) => Promise.reject({failReason: 'tired', b: data.a + 1});
        const wrapped = wrapStep(func);
        return wrapped({a: 1})
            .catch((data) => {
                assert.deepEqual(data, {b: 2, failReason: 'tired'});
                done();
            });
    });
});
