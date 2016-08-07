'use strict';

const analyticsService = require('../analytics.service');
const config = require('../../../config');
const successHandler = require('../handlers/success.handler');
const errorHandler = require('../handlers/error.handler');
const db = require('../../db.service');
const dates = {
    startDate: "2016-06-01",
    endDate: "2016-06-30"
};
analyticsService.updateDB(dates)
    .then((data)=>{
        if (data && data.success) {
            successHandler.onSuccess(config.googleService.name);
        } else {
            errorHandler.onError('No success message returned');
        }
    });
// Promise.resolve()
//     .then(db.connectDB)
// analyticsService.getDeviceProfits(dates)
//     .then((data)=>{
//         console.log(data);
//     });
