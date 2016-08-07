'use strict';
const express = require('express');
const campaigns = require('./campaigns.controller');
const router = express.Router();
const csv = require('./csv.controller');
const todos = require('./todos.controller');

router.get('/profit/campaigns', campaigns.getCampaignProfits);
router.get('/profit/device', campaigns.getDeviceProfits);
router.get('/profit/total', campaigns.getProfit);
router.get('/profit/performance', campaigns.getCampaignPerformances);

router.get('/todo', todos.getAll);
router.post('/todo', todos.create);
router.put('/todo/:id', todos.update);
router.delete('/todo/:id', todos.delete);

router.get('/csv', csv.getCSV);


module.exports = router;
