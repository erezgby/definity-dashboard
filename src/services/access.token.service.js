'use strict';
const config = require('../config');
const redis = require('redis');
const Promise = require('bluebird');
const moment = require('moment');

const redisClient = redis.createClient(config.db.redis.port, config.db.redis.host);
Promise.promisifyAll(redis);

const _updateAccessToken = (accessToken, accessTokenExpiration, prefix) => {
    const redisTasks = [redisClient.set(`${prefix}accessToken`, accessToken),
        redisClient.set(`${prefix}accessTokenExpiring`, accessTokenExpiration)];
    return Promise.all(redisTasks);
};

const getAccessToken = (requestAccessToken, prefix) => {
    return new Promise((resolve, reject) => {
        let newAccessTokenIsNeeded = false;
        const redisGets = [redisClient.getAsync(`${prefix}accessTokenExpiring`),
            redisClient.getAsync(`${prefix}accessToken`)];
        Promise.all(redisGets)
            .then((data) => {
                const expirationDateStr = data[0];
                const accessToken = data[1];
                if (expirationDateStr) {
                    const now = moment();
                    const expiring = moment(expirationDateStr, 'x');
                    if (expiring.diff(now) < config.accessToken.expiryPeriod) {
                        // expiration date is in less than expiryPeriod
                        newAccessTokenIsNeeded = true;
                    }
                } else {
                    newAccessTokenIsNeeded = true;
                }
                if (newAccessTokenIsNeeded)  {
                    requestAccessToken()
                        .then((access)=> {
                            _updateAccessToken(access.access_token, access.expiry_date, prefix);
                        });
                    // .catch(reject({msg: 'revcontent API error1'}));
                } else {
                    return resolve(accessToken);
                }
            });
        // .catch(reject({msg: 'revcontent API error'}));
    });
};

const service = {};

service.getAccessToken = getAccessToken;

module.exports = service;