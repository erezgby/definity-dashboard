'use strict';
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const moment = require('moment');
const json2csv = require('json2csv');
const db = require('./db.service');
const config = require('../config');

Promise.promisifyAll(fs);

const writeCSVFile = (filters) => {
    filters.startDate = filters.startDate  || moment().format('YYYY-MM-DD');
    filters.endDate = filters.endDate  || moment().format('YYYY-MM-DD');
    filters.modelName = filters.modelName || config.db.models.adsenseAd;
    const model = db.getDBModel(filters.modelName);
    const fields = Object.keys(model.schema.paths);

    return Promise.resolve()
        .then(db.connectDB)
        .then(_createFilesDirIfNotExist)
        .then(()=>{
            return model.find(
                {date: {$gte: new Date(filters.startDate)}},
                        {$lte: new Date(filters.endDate)}
            )})
        .then(data => {
            const csv = json2csv({data: data, fields: fields});
            return fs.writeFileAsync(getFileName(filters), csv);
        })
        .catch(err=>{
            return Promise.reject(err);
        });
};
const getFileName = (filters) =>{
    return `${config.csv.dirName}/${filters.modelName}-data-${filters.startDate}--${filters.endDate}.csv`;
};

const _createFilesDirIfNotExist = () => {
    fs.accessAsync(config.csv.dirName, fs.R_OK | fs.W_OK)
        .then(() => {
            return Promise.resolve(true);
        })
        .catch(() => {
            return fs.mkdirAsync(config.csv.dirName);
        })
};

const service = {};
service.writeCSVFile = writeCSVFile;
service.getFileName = getFileName;

module.exports = service;