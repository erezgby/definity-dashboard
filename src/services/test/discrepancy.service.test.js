'use strict';

const discrepancyService = require('../discrepancy.service');
const config = require('../../config');
const successHandler = require('../third_party/handlers/success.handler');
const errorHandler = require('../third_party/handlers/error.handler');

const dates = {
    startDate: "2016-07-01",
    endDate: "2016-07-24"
};
discrepancyService.getDiscrepancy(dates)
    .then((data)=>{
        if (data && data.success) {
            successHandler.onSuccess(config.discrepancy.name);
        } else {
            errorHandler.onError('No success message returned');
        }
    });
