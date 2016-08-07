'use strict';

const csvService = require('../services/csv.service');

const getCSV = (req, res) => {
    csvService.writeCSVFile(req.query)
        .then((data) => {
            console.log(data);
            res.download(csvService.getFileName(req.query));
        })
        .catch(err => {
            res.status(500).json({ err: err.message })
        });
};

const service = {};
service.getCSV = getCSV;
module.exports = service;