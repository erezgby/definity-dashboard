'use strict';

var mongoose = require('mongoose');

var revContentBoostSchema = new mongoose.Schema({
    id: String,
    boostId: String,
    name: String,
    date: Date,
    startDate: Date,
    impressions: Number,
    clicks: Number,
    conversions: Number,
    targetingType: String,
    enabled: Boolean,
    minBid: Number,
    maxBid: Number,
    budget: String,
    cost: String,
    CTR: Number,
    averageCPC: Number,
    profit: Number
});

revContentBoostSchema.index({id:1}, {unique: true});
var model = mongoose.model('RevcontentBoost', revContentBoostSchema);
module.exports = model;
