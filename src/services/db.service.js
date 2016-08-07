'use strict';
const config = require('../config');
const Promise = require('bluebird');
const mongoose = require ('mongoose');
const adsenseAd = require('../models/adsenseAd');
const discrepancy = require('../models/discrepancy');
const revContentBoost = require('../models/revContentBoost');
const revContentWidget = require('../models/revContentWidget');
const moment = require('moment');

mongoose.Promise = Promise;

const getDBModel = (modelName) => {
    if (modelName === config.db.models.adsenseAd) {
        return adsenseAd;
    } else if (modelName === config.db.models.discrepancy) {
        return discrepancy;
    } else if (modelName === config.db.models.revcontentBoost) {
        return revContentBoost;
    } else if (modelName === config.db.models.revcontentWidget) {
        return revContentWidget;
    }
};

const connectDB = () => {
    if (mongoose.connection.readyState === 0) {
        return mongoose.connect(config.db.mongodb.host);
    } else {
        return Promise.resolve(true);
    }
};

const multipleUpsert = (model, items)=> {
    return Promise.map(items, (item)=> {
        return model.findOneAndUpdate({id: item.id}, item, {upsert: true});
    });
};

const deleteOldDocs = () => {
    const dateBefore = moment().subtract(config.db.timeFrame.period, 'months');
    const condition = { date : {$lt: dateBefore} };
    const promises = [
        adsenseAd.remove(condition),
        discrepancy.remove(condition),
        revContentBoost.remove(condition),
        revContentWidget.remove(condition)
    ];
    return Promise.all(promises);
};

const service = {};
service.connectDB = connectDB;
service.multipleUpsert = multipleUpsert;
service.getDBModel = getDBModel;
service.deleteOldDocs = deleteOldDocs;

module.exports = service;