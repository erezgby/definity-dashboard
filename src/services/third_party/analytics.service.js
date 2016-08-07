'use strict';
const config = require('../../config');
const Promise = require('bluebird');
const google = require('googleapis');
const accessToken = require('../access.token.service');
const analyticsReporting = google.analyticsreporting('v4');
const moment = require('moment');
const adsenseAd = require('../../models/adsenseAd');
const hash = require('object-hash');
const db = require('../db.service');
const errorHandler = require('./handlers/error.handler');

const authClient = new google.auth.JWT(
    config.googleService.clientEmail,
    null,
    config.googleService.privateKey,
    ['https://www.googleapis.com/auth/adsense.readonly',
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly']);

const _getAccessToken = () => {
    const _requestAccessToken = () => {
        return new Promise((resolve, reject) => {
            authClient.authorize((err, tokens) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tokens);
            });
        });
    };
    return accessToken.getAccessToken(_requestAccessToken, config.google.prefix);
};

const _getAllAds = (filters, accessToken) => {
    filters = filters || {};
    const startDate = filters.startDate || moment().format('YYYY-MM-DD');
    const endDate = filters.endDate || moment().format('YYYY-MM-DD');
    authClient.setCredentials({
        access_token: accessToken
    });
    const requestParams = {
        headers: {
            "Content-Type": "application/json"
        },
        auth: authClient,
        resource: {
            reportRequests: [{
                viewId: '119196240',
                dateRanges: [{
                    startDate: startDate,
                    endDate: endDate
                }],
                dimensions: [
                    {name: 'ga:date'},
                    {name: 'ga:source'},
                    {name: 'ga:campaign'},
                    {name: 'ga:medium'},
                    {name: 'ga:deviceCategory'}
                ],
                metrics: [
                    {expression: 'ga:sessions', formattingType: 'INTEGER'},
                    {expression: 'ga:bounceRate', formattingType: 'PERCENT'},
                    {expression: 'ga:avgSessionDuration', formattingType: 'TIME'},
                    {expression: 'ga:pageviews', formattingType: 'INTEGER'},
                    {expression: 'ga:pageviewsPerSession', formattingType: 'FLOAT'},
                    {expression: 'ga:adsenseRevenue', formattingType: 'CURRENCY'},
                    {expression: 'ga:adsenseAdsClicks', formattingType: 'INTEGER'},
                    {expression: 'ga:adsenseCTR', formattingType: 'PERCENT'},
                    {expression: 'ga:adsenseECPM', formattingType: 'CURRENCY'},
                    {expression: 'ga:adsenseCoverage', formattingType: 'PERCENT'}
                ]
            }]
        }
    };
    if (filters.nextPageToken) {
        requestParams.resource.reportRequests[0].pageToken = filters.nextPageToken;
    }
    return new Promise((resolve, reject) => {
        analyticsReporting.reports.batchGet(requestParams, (err, response)=> {
            if (err) {
                return reject(err);
            }
            return resolve(response);
        });
    });
};

const _saveAds = (ads)=> {
    return db.multipleUpsert(adsenseAd, ads);
};

const _parseResponse = (filters, data) => {
    if (data.reports[0].data.rows) {
        const ads = data.reports[0].data.rows.map((obj)=> {
            const dimensions = {
                date: moment(obj.dimensions[0], 'YYYYMMDD').toDate(),
                source: obj.dimensions[1],
                campaign: obj.dimensions[2],
                medium: obj.dimensions[3],
                deviceCategory: obj.dimensions[4]
            };
            const metricses = {
                sessions: obj.metrics[0].values[0],
                bounceRate: obj.metrics[0].values[1],
                avgSessionDuration: obj.metrics[0].values[2],
                pageViews: obj.metrics[0].values[3],
                pageViewsPerSession: obj.metrics[0].values[4],
                adsenseRevenue: obj.metrics[0].values[5],
                adsenseAdsClicks: obj.metrics[0].values[6],
                adsenseCTR: obj.metrics[0].values[7],
                adsenseECPM: obj.metrics[0].values[8],
                adsenseCoverage: obj.metrics[0].values[9]
            };
            const id = hash(dimensions);
            return Object.assign({id: id}, dimensions, metricses);
        });
        const promises = [_saveAds(ads)];
        if (data.reports[0].nextPageToken) {
            filters = filters || {};
            Object.assign(filters, {nextPageToken: data.reports[0].nextPageToken});
            promises.unshift(updateDB(filters));
        }
        return Promise.all(promises);
    }
    return Promise.resolve({success: true});
};

const _resolveWhenDone = () => {
    return Promise.resolve({success: true});
};

const updateDB = (filters) => {
    console.log(`started new analytics batch for ${filters.startDate}:${filters.endDate}`);
    return Promise.resolve()
        .then(db.connectDB)
        .then(_getAccessToken)
        .then(_getAllAds.bind(null, filters))
        .then(_parseResponse.bind(null, filters))
        .then(_resolveWhenDone)
        .catch(errorHandler.onError);
};

const getStats = (filters) => {
    filters = filters || {};
    const startDate = filters.startDate || moment().format('YYYY-MM-DD');
    const endDate = filters.endDate || moment().format('YYYY-MM-DD');
    return adsenseAd.find({});
}

const _getAggregatedProfits = (filters) => {
    filters = filters || {};
    filters.startDate = filters.startDate  || moment().format('YYYY-MM-DD');
    filters.endDate = filters.endDate  || moment().format('YYYY-MM-DD');
    const groupBy = filters.groupBy || '';
    return adsenseAd.aggregate(
        [
            {$match: {date: {$gte: new Date(filters.startDate)}}},
            {$match: {date: {$lte: new Date(filters.endDate)}}},
            {$match: {trueClicks: {$gte: 0}}},
            {$group: {
                _id: groupBy,
                totalCost: {$sum: '$cost'},
                totalRevenue: {$sum: '$adsenseRevenue'},
                totalProfit: {$sum: '$profit'}
            }},
            {$sort:  {_id: 1}}
        ]
    )
};

const getCampaignProfits = (filters) => {
    filters.groupBy = '$campaign';
    return _getAggregatedProfits(filters);
};

const getDeviceProfits = (filters) => {
    filters.groupBy = '$deviceCategory';
    return _getAggregatedProfits(filters);
};

const getTotalProfit = (filters) => {
    return _getAggregatedProfits(filters);
};

const getCampaignPerformances = (filters) => {
    filters = filters || {};
    filters.startDate = filters.startDate  || moment().format('YYYY-MM-DD');
    filters.endDate = filters.endDate  || moment().format('YYYY-MM-DD');
    filters.limit = filters.limit || 5;
    return adsenseAd.aggregate([
        {$match: {date: {$gte: new Date(filters.startDate)}}},
        {$match: {date: {$lte: new Date(filters.endDate)}}},
        {$match: {trueClicks: {$gte: 0}}},
        { $group: {
            _id: {
                campaign: '$campaign',
                date: '$date'
            },
            totalCost: {$sum: '$cost'},
            totalRevenue: {$sum: '$adsenseRevenue'},
            totalProfit: {$sum: '$profit'}
        }},
        { $group: {
            _id: '$_id.campaign',
            profits: {
                $push: {
                    date: '$_id.date',
                    totalCost: '$totalCost',
                    totalRevenue: '$totalRevenue',
                    totalProfit: '$totalProfit'
                }
            },
            totalProfit: { $sum: '$totalProfit' }}
        },
        { $sort: { totalProfit: -1 } },
        { $limit: filters.limit },
        { $unwind: '$profits' },
        { $sort: { totalProfit: 1, 'profits.date': 1} },
        { $group: {
            _id: '$_id',
            totalProfit: {'$first': '$totalProfit'},
            profits: { $push: '$profits' }
        }}
    ]);
};

const service = {};
service.getDeviceProfits = getDeviceProfits;
service.getCampaignProfits = getCampaignProfits;
service.getTotalProfit = getTotalProfit;
service.updateDB = updateDB;
service.getStats = getStats;
service.getCampaignPerformances = getCampaignPerformances;
module.exports = service;
