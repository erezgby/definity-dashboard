'use strict';
const cron = require('node-cron');
const db = require('../services/db.service');
const updateData = require('../services/update.data.service');

// update DB every 4 hours
cron.schedule('0 0,4,8,12,16,20 * * *', updateData.updateDB, true);

// delete old documents every 1st of the month
cron.schedule('0 0 1 * *', db.deleteOldDocs(), true);