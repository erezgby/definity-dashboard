'use strict';

const onSuccess = (moduleName)=> {
    console.log(`Successfully updated DB from ${moduleName} API`);
    // return Promise.resolve(true);
    process.exit(0);
};

const service = {};
service.onSuccess = onSuccess;
module.exports = service;