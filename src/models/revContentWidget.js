'use strict';

var mongoose = require('mongoose');

var revContentWidgetSchema = new mongoose.Schema({
    id: String,
    widgetID: String,
    name: String,
    startDate: Date,
    endDate: Date,
    impressions: Number,
    CTR: Number,
    clicks: Number,
    CPC: Number,
    RPM: Number,
    revenue: Number
});

revContentWidgetSchema.index({id:1}, {unique: true});
var model = mongoose.model('RevcontentWidget', revContentWidgetSchema);
module.exports = model;
