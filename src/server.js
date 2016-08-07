'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = require('./api');
const config = require('./config');
const dbService = require('./services/db.service');

dbService.connectDB()
    .then(()=>{
        const app = express();

        // Middlewares
        app.use(bodyParser.json());
        app.use(cors());
        app.use(morgan('dev'));
        app.use('/api', router);

        if (config.seed.todos) {
            require('./services/seed/todos.seed');
        }

        app.listen(config.appServer.port, function() {
            console.log("The app server is running on port " + config.appServer.port);
        });

    })
    .catch(() => {
        console.log('DB failed To Connect');
    });