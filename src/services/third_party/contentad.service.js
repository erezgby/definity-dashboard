'use strict';

// TODO: Replace functions with real API calls

const updateWidgetsDB = () => {
    return Promise.resolve({success: true});
};

const updateCampaignsDB = () => {
    return Promise.resolve({success: true});
};

const service = {};
service.updateWidgetsDB = updateWidgetsDB;
service.updateCampaignsDB = updateCampaignsDB;

module.exports = service;
