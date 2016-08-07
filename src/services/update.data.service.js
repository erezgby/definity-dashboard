'use strict';
const config = require('../config');
const redis = require('redis');
const Promise = require('bluebird');
const moment = require('moment');
const db = require('./db.service');
const analytics = require('./third_party/analytics.service');
const revContent = require('./third_party/revcontent.service');
const mgid = require('./third_party/mgid.service');
const contentAd = require('./third_party/contentad.service');
const outbrain = require('./third_party/outbrain.service');
const discrepancy = require('./discrepancy.service');
const sequencePromise = require('../utils/sequence-promise');

const redisClient = redis.createClient(config.db.redis.port, config.db.redis.host);
Promise.promisifyAll(redis);

const _getDBUpdateDates = () => {
    const promises = [redisClient.getAsync(config.db.timeFrame.prefix.startDate),
        redisClient.getAsync(config.db.timeFrame.prefix.endDate)];
    return Promise.all(promises);
};

const _setStartDate = (date) => {
    return redisClient.setAsync(config.db.timeFrame.prefix.startDate, date)
};

const _setendDate = (date) => {
    return redisClient.setAsync(config.db.timeFrame.prefix.endDate, date)
};

const _initialAPIsUpdate = () => {
    // The first DB update. update last config.db.timeFrame.period months, currently 6
    const requests = [];
    for (let i = 0; i < config.db.timeFrame.period; i++) {
        // Analytics - We will get the last 6 months in 6 API requests, 1 for each month
        const startOfMonth = moment().subtract(i, 'month').startOf('month');
        const endOfMonth = (i === 0) ? moment() : moment().subtract(i, 'month').endOf('month');

        const analyticsDates = {
            startDate: startOfMonth.format('YYYY-MM-DD'),
            endDate: endOfMonth.format('YYYY-MM-DD')
        };
        requests.push(analytics.updateDB.bind(null, analyticsDates));
        const month = startOfMonth.get('month');
        const year = startOfMonth.get('year');
        // RevContent - We will get the last 6 months in ~180 API requests, 1 for each day
        // The reason is RevContent provides an aggregated results and we want to be able to provide
        // data for any time range
        for (let day = startOfMonth.get('date'); day < (endOfMonth.get('date') + 1); day++) {
            const date = moment([year, month, day]);
            const revContentDates = {
                startDate: date.format('YYYY-MM-DD'),
                endDate: date.format('YYYY-MM-DD')
            };
            requests.push(revContent.updateBoostsDB.bind(null, revContentDates));
            requests.push(revContent.updateWidgetsDB.bind(null, revContentDates));
        }
    }
    // return Promise.all([sequencePromise.multipleResultsWaterfall(analyticsRequests),
    //     sequencePromise.multipleResultsWaterfall(revContentRequests)]);
    return sequencePromise.multipleResultsWaterfall(requests);
};

const _regularAPIsUpdate = (updatedTo) => {
    const analyticsRequests = [];
    const revContentRequests = [];

    const updateDate = moment().subtract(config.db.timeFrame.updatePeriod - 1, 'day');
    const analyticsDates = {
        startDate: updatedTo ? Math.min(updateDate, updatedTo).format('YYYY-MM-DD'):
            updateDate.format('YYYY-MM-DD'),
        endDate: updateDate.format('YYYY-MM-DD')
    };
    analyticsRequests.push(analytics.updateDB(analyticsDates));

    for (let i = 0; i < config.db.timeFrame.updatePeriod; i++) {
        const date = moment().subtract(i, 'day').format('YYYY-MM-DD');
        const revContentDates = {
            startDate: date,
            endDate: date
        };
        revContentRequests.push(revContent.updateBoostsDB(revContentDates));
        revContentRequests.push(revContent.updateWidgetsDB(revContentDates));
    }
    return Promise.all([sequencePromise.multipleResultsWaterfall(analyticsRequests),
        sequencePromise.multipleResultsWaterfall(revContentRequests)]);
};

const _apiUpdate = () => {
    let filters = {};
    return Promise.resolve()
        .then(_getDBUpdateDates)
        .then(dates => {
            const updatedFrom = dates[0];
            const updatedTo = dates[1];
            if (updatedFrom) {
                return _regularAPIsUpdate(updatedTo);
                filters.startDate = updatedFrom;
                filters.endDate = updatedTo || moment().format('YYYY-MM-DD');
            } else {
                const startDate = moment().subtract(config.db.timeFrame.period - 1, 'month').startOf('month');
                filters.startDate = startDate;
                filters.endDate = updatedTo || moment().format('YYYY-MM-DD');
                return Promise.all([_setStartDate(startDate.format('YYYY-MM-DD')), _initialAPIsUpdate()]);
            }
        })
        .then(discrepancy.getDiscrepancy.bind(null, filters))
        .catch(err => {
            return err;
        });
};

const updateDB = () => {
    _apiUpdate()
        .then(() => {
            _setendDate(moment().format('YYYY-MM-DD'));
            console.log('!!! Updated DB Successfully !!!');
        });
};

updateDB();

const service = {};
service.updateDB = updateDB;
module.exports = service;