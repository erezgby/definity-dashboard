'use strict';

const analytics = require('../services/third_party/analytics.service');

const getCampaignProfits = (req, res) => {
    analytics.getCampaignProfits(req.query)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ err: err.message })
        });
};

const getDeviceProfits = (req, res) => {
    analytics.getDeviceProfits(req.query)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ err: err.message })
        });
};

const getProfit = (req, res) => {
    analytics.getTotalProfit(req.query)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ err: err.message })
        });
};

const getCampaignPerformances = (req, res) => {
    analytics.getCampaignPerformances(req.query)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(500).json({ err: err.message })
        });
};


const service = {};
service.getProfit = getProfit;
service.getCampaignProfits = getCampaignProfits;
service.getDeviceProfits = getDeviceProfits;
service.getCampaignPerformances = getCampaignPerformances;
module.exports = service;