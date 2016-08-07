'use strict';
const db = require('./db.service');
const Promise = require('bluebird');
const moment = require('moment');
const config = require('../config')
const adsenseAd = db.getDBModel(config.db.models.adsenseAd);
const discrepancy = db.getDBModel(config.db.models.discrepancy);
const hash = require('object-hash');
const errorHandler = require('./third_party/handlers/error.handler');

const _getAggregateAdsenseData = (filters)=> {
    return adsenseAd.aggregate(
        [{$match: {source: filters.sourceName}},
        {$match: {date: {$gte: new Date(filters.startDate)}}},
        {$match: {date: {$lte: new Date(filters.endDate)}}},
        {$group: {_id: '$campaign', totalClicks: {$sum: '$sessions'}}},
        {$sort:  {_id: 1}}]
    );
};

const _getSourceData = (filters, campaigns)=> {
    const model = db.getDBModel(filters.modelName);
    const campaignNames = campaigns.map(campaign => {
        return campaign._id;
    });
    return new Promise((resolve, reject) => {
        model.aggregate(
            [{$match: {name: {$in: campaignNames}}},
            {$match: {date: {$gte: new Date(filters.startDate)}}},
            {$match: {date: {$lte: new Date(filters.endDate)}}},
            {$group: {_id: '$name', CPC: {$first: '$averageCPC'}, totalClicks: {$sum: '$clicks'}}},
            {$sort:  {_id: 1}}]
        ).then(sourceData => {
                return resolve({
                    sourceData: sourceData,
                    adsenseData: campaigns
                });
            }).catch(err => {
            return reject(err);
        });
    });
};

const _updateCollections = (filters, data) => {
    const model = db.getDBModel(filters.modelName);
    const promises = [];
    let adsenseI = 0;
    let sourceI = 0;
    while (adsenseI < data.adsenseData.length && sourceI < data.sourceData.length) {
        const adsenseReport = data.adsenseData[adsenseI];
        const sourceReport = data.sourceData[sourceI];
        if (adsenseReport._id === sourceReport._id) {
            const discrepancyCalc = sourceReport.totalClicks / (adsenseReport.totalClicks || 1);
            const item = {
                id: hash({
                    campaignName: adsenseReport._id, source: filters.sourceName,
                    startDate: filters.startDate, endDate: filters.endDate
                }),
                campaignName: adsenseReport._id,
                source: filters.sourceName,
                startDate: filters.startDate,
                endDate: filters.endDate,
                sourceClicks: sourceReport.totalClicks,
                analyticsClicks: adsenseReport.totalClicks,
                discrepancy: discrepancyCalc
            };
            promises.push(discrepancy.findOneAndUpdate(
                {id: item.id}, item, {upsert: true}));
            promises.push(
                adsenseAd.find(
                    {campaign: adsenseReport._id}//,
                    // {date: {$gte: new Date(filters.startDate)}},
                    // {date: {$lte: new Date(filters.endDate)}}
                ).then((data) => {
                    const updatePromises = [];
                    data.forEach(obj=> {
                        const doc = obj._doc;
                        const trueClicks = doc.sessions * discrepancyCalc;
                        const cost = trueClicks * sourceReport.CPC;
                        const profit = doc.adsenseRevenue - cost;
                        const adsenseUpdate = {
                            trueClicks: trueClicks,
                            CPC: sourceReport.CPC,
                            cost: cost,
                            profit: profit
                        };
                        Object.assign(doc, adsenseUpdate);
                        updatePromises.push(adsenseAd.findOneAndUpdate({id: doc.id}, doc, {upsert: true}));
                    });
                    return Promise.all(updatePromises);
                })
            );
            adsenseI++;
            sourceI++;
        } else {
            if (adsenseReport._id.localeCompare(sourceReport._id) < 0) {
                adsenseI++;
            } else {
                sourceI++;
            }
        }
    }
    return Promise.all(promises);
};

const _resolveWhenDone = () => {
    return Promise.resolve({success: true});
};

const getDiscrepancy = (filters)=> {
    console.log('started updating discrepancies');
    filters = filters|| {};
    filters.startDate = filters.startDate  || moment().format('YYYY-MM-DD');
    filters.endDate = filters.endDate  || moment().format('YYYY-MM-DD');
    filters.sourceName = filters.sourceName || 'Revcontent';
    filters.modelName = filters.modelName || config.db.models.revcontentBoost;

    return Promise.resolve()
        .then(db.connectDB)
        .then(_getAggregateAdsenseData.bind(null, filters))
        .then(_getSourceData.bind(null, filters))
        .then(_updateCollections.bind(null, filters))
        .then(_resolveWhenDone)
        .catch(errorHandler.onError);
};

const service = {};
service.getDiscrepancy = getDiscrepancy;
module.exports = service;