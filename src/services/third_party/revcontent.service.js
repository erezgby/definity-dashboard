'use strict';
const requestPromise = require('request-promise');
const config = require('../../config');
const Promise = require('bluebird');
const accessToken = require('../access.token.service');
const moment = require('moment');
const revContentBoost = require('../../models/revContentBoost');
const revContentWidget = require('../../models/revContentWidget');
const hash =require('object-hash');
const db = require('../db.service');
const errorHandler = require('./handlers/error.handler');

const _createRequest = (filters, accessToken, uri) => {
    let qsParams = [];
    qsParams.push({limit:config.revContent.batchSize});
    for (const prop in filters) {
        if (filters.hasOwnProperty(prop)) {
            qsParams.push(`${prop}=${filters[prop]}`);
        }
    }
    uri += "?" + qsParams.join("&");
    const options = {
        method: 'GET',
        uri: uri,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'content-type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };
    return requestPromise(options);
};

const _getAccessToken = () => {
    const _requestAccessToken = () => {
        const options = {
            method: 'POST',
            uri: 'https://api.revcontent.io/oauth/token',
            form: {
                grant_type: 'client_credentials',
                client_id: config.revContent.clientKey,
                client_secret: config.revContent.clientSecret
            },
            headers: {
                /* 'content-type': 'application/x-www-form-urlencoded' */ // Set automatically
            }
        };
        return new Promise((resolve, reject) => {
            requestPromise(options)
                .then((accessStr) => {
                    const access = JSON.parse(accessStr);
                    return resolve({
                        access_token: access.access_token,
                        expiry_date: moment().add(access.expires_in, 'seconds').valueOf()
                    });
                })
                .catch((err)=> {
                    return reject(err);
                });
        });
    };
    return accessToken.getAccessToken(_requestAccessToken, config.revContent.prefix);
};

const _resolveWhenDone = () => {
    return Promise.resolve({success: true});
};

// ******** Widgets ******** //
const _getAllWidgets = (filters, accessToken) => {
    return new Promise((resolve, reject) => {
        _createRequest(filters, accessToken, 'https://api.revcontent.io/stats/api/v1.0/widgets')
            .then(data => {resolve({accessToken: accessToken, widgetsStr: data})})
            .catch(err => {reject(err)});
    });
};

const _parseWidgets = (filters, data) => {
    const widgets = JSON.parse(data.widgetsStr).data;
    const promises = [];
    if (widgets.length === config.revContent.batchSize) {
        if (filters.offset) {
            filters.offset += config.revContent.batchSize;
        } else {
            filters.offset = config.revContent.batchSize;
        }
        promises.push(updateWidgetsDB(filters));
    }
    promises.push(Promise.resolve({widgets}));
    return Promise.all(promises);
};

const _saveWidgets = (filters, data) => {
    let lastBatch = true;
    if (data.length > config.revContent.batchSize) {
        lastBatch = false;
        data.shift(); //first item is the next batch response
    }
    const widgetsData = data[0].widgets;
    const widgets = [];
    widgetsData.forEach((widget) => {
        widgets.push({
            id: hash({widgetName: widget.name, dateFrom: filters.date_from, dateTo: filters.date_to}),
            widgetID: widget.id,
            name: widget.name,
            startDate: new Date(filters.date_from),
            endDate: new Date(filters.date_to),
            impressions: widget.widget_imps,
            CTR: widget.ad_ctr,
            clicks: widget.ad_clicks,
            CPC: widget.ad_cpc,
            RPM: widget.ad_rpm,
            revenue: widget.ad_revenue
        });
    });
    if (lastBatch) {
        return db.multipleUpsert(revContentWidget, widgets)
            .then(data=> {
                return Promise.resolve({data: data, done: true})
            });
    }
    return db.multipleUpsert(revContentWidget, widgets);
};

const updateWidgetsDB = (filters) => {
    filters = filters|| {};
    filters.date_from = filters.date_from || filters.startDate  || moment().format('YYYY-MM-DD');
    filters.date_to = filters.date_from || filters.endDate || moment().format('YYYY-MM-DD');
    if (filters.startDate) {
        delete filters.startDate;
    }
    if (filters.endDate) {
        delete filters.endDate;
    }
    console.log(`started new revcontent widgets batch for ${filters.date_from}:${filters.date_to}`);

    return Promise.resolve()
        .then(db.connectDB)
        .then(_getAccessToken)
        .then(_getAllWidgets.bind(null, filters))
        .then(_parseWidgets.bind(null, filters))
        .then(_saveWidgets.bind(null, filters))
        .then(_resolveWhenDone)
        .catch(errorHandler.onError)
};


// ******** Boosts ******** //
const _getAllBoosts = (filters, accessToken) => {
    return new Promise((resolve, reject) => {
        _createRequest(filters, accessToken, 'https://api.revcontent.io/stats/api/v1.0/boosts')
            .then(data => {resolve({accessToken: accessToken, boostsStr: data})})
            .catch(err => {reject(err)});
    });
};

const _parseBoosts = (filters, data) => {
    const accessToken = data.accessToken;
    const boosts = JSON.parse(data.boostsStr).data;
    const boostsPerformancesPromises = boosts.map((boost) => {
        return (_getBoostPerformance(boost, filters, accessToken))
    });
    if (boosts.length === config.revContent.batchSize) {
        if (filters.offset) {
            filters.offset += config.revContent.batchSize;
        } else {
            filters.offset = config.revContent.batchSize;
        }
        boostsPerformancesPromises.unshift(updateBoostsDB(filters));
    }
    return Promise.all(boostsPerformancesPromises);
};

const _saveBoosts = (data) => {
    let lastBatch = true;
    if (data.length > config.revContent.batchSize) {
        lastBatch = false;
        data.shift(); //first item is the next batch response
    }
    const boosts = [];
    data.forEach(item => {
        // At the moment boosts that get no performance data are not saved
        const boostPerformances = JSON.parse(item.boostPerformanceStr);
        boostPerformances.data.forEach((boostPerformance) => {
            boosts.push({
                id: hash({boostID: item.boost.id, date: boostPerformance.date}),
                boostId: item.boost.id,
                name: item.boost.name,
                date: new Date(boostPerformance.date),
                impressions: boostPerformance.impressions,
                clicks: boostPerformance.clicks,
                conversions: boostPerformance.conversions,
                targetingType: item.boost.targeting_type,
                enabled: (item.boost.enabled === 'active'),
                minBid: item.boost.min_bid,
                maxBid: item.boost.max_bid,
                budget: item.boost.budget,
                cost: boostPerformance.cost,
                CTR: boostPerformance.ctr,
                averageCPC: boostPerformance.avg_cpc,
                profit: boostPerformance.profit
            });
        });
    });
    if (lastBatch) {
        return db.multipleUpsert(revContentBoost, boosts)
            .then(data=> {
                return Promise.resolve({data: data, done: true})
            });
    }
    return db.multipleUpsert(revContentBoost, boosts);
};

/**
 * WARNING: this function will work on up to 100 days of boosts performance.
 * for longer prtiod, a recursive API call should be added.
 */
const _getBoostPerformance = (boost, filters, accessToken) => {
    const boostsFilters = {};
    Object.assign(boostsFilters, filters, {boost_id: boost.id});
    // we don't want to use the offset filter, since it's the previous request offset
    delete boostsFilters.offset;
    return new Promise((resolve, reject) => {
        _createRequest(boostsFilters, accessToken, 'https://api.revcontent.io/stats/api/v1.0/boosts/performance')
            .then(data => {resolve({boost: boost, boostPerformanceStr: data})})
            .catch(err => {reject(err)});
    });
};

const updateBoostsDB = (filters) => {
    filters = filters|| {};
    filters.date_from = filters.date_from || filters.startDate  || moment().format('YYYY-MM-DD');
    filters.date_to = filters.date_from || filters.endDate || moment().format('YYYY-MM-DD');
    if (filters.startDate) {
        delete filters.startDate;
    }
    if (filters.endDate) {
        delete filters.endDate;
    }
    console.log(`started new revcontent boosts batch for ${filters.date_from}:${filters.date_to}`);

    return Promise.resolve()
        .then(db.connectDB)
        .then(_getAccessToken)
        .then(_getAllBoosts.bind(null, filters))
        .then(_parseBoosts.bind(null, filters))
        .then(_saveBoosts)
        .then(_resolveWhenDone)
        .catch(errorHandler.onError)
};

const service = {};
service.updateWidgetsDB = updateWidgetsDB;
service.updateBoostsDB = updateBoostsDB;

module.exports = service;
