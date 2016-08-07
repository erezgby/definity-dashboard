'use strict';

const csvService = require('../csv.service');
const config = require('../../config');

const dates = {
    startDate: "2016-07-01",
    endDate: "2016-07-24"
};

csvService.writeCSVFile(dates)
.then(data=>{
    console.log('success ' + data);
});