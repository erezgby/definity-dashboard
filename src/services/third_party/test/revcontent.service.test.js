'use strict';

const revcontentService = require('../revcontent.service');
const config = require('../../../config');
const successHandler = require('../handlers/success.handler');
const errorHandler = require('../handlers/error.handler');

const dates = {
    date_from: '2016-01-01',
    date_to: '2016-07-19'
};
// revcontentService.updateBoostsDB(dates)
//     .then((data)=>{
//         if (data && data.success) {
//             successHandler.onSuccess(config.revContent.name);
//         } else {
//             errorHandler.onError('No success message returned');
//         }
//     });

revcontentService.updateWidgetsDB(dates)
    .then((data)=>{
        if (data && data.success) {
            successHandler.onSuccess(config.revContent.name);
        } else {
            errorHandler.onError('No success message returned');
        }
    });
