'use strict';

var mongoose = require('mongoose');

var discrepancySchema = new mongoose.Schema({
    id: String,
    campaignName: String,
    source: String,
    startDate: Date,
    endDate: Date,
    sourceClicks: Number,
    analyticsClicks: Number,
    discrepancy: Number
    // RPM: Number,
    // revenue: Number
});

discrepancySchema.index({id:1}, {unique: true});
var model = mongoose.model('discrepancy', discrepancySchema);
module.exports = model;
