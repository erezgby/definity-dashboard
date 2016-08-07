'use strict';

var mongoose = require('mongoose');

var andsenseAdSchema = new mongoose.Schema({
    id:String,
    // Dimensions
    date: Date,
    source: String,
    campaign: String,
    medium: String,
    deviceCategory: String,
    // Metrics
    sessions: Number,
    bounceRate: Number,
    avgSessionDuration: Number,
    pageViews: Number,
    pageViewsPerSession: Number,
    adsenseRevenue: Number,
    adsenseAdsClicks: Number,
    adsenseCTR: Number,
    adsenseECPM: Number,
    adsenseCoverage: Number,
    //calculated
    trueClicks: Number,
    CPC: Number,
    cost: Number,
    profit: Number
});

andsenseAdSchema.index({id:1}, {unique: true});
var model = mongoose.model('adsenseAd', andsenseAdSchema);
module.exports = model;
