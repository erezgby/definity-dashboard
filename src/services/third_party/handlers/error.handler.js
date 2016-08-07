'use strict';

const onError = (err) => {
    const errMessage = (err && err.err) || err;
    console.log(errMessage);
    process.exit(-1);
};
const service = {};
service.onError = onError;
module.exports = service;