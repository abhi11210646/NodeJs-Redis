'use strict';
const redisClient = require('./index');
module.exports = {
    for: (key) => {
        const increase = () => {
            return redisClient.incrAsync(key);
        };
        const get = () => {
            return redisClient.getAsync(key);
        };
        const reset = () => {
            return redisClient.delAsync(key);
        };
        const expire = (time) => {
            return redisClient.expireAsync(key, time);
        };
        const ttl = () => {
            return redisClient.ttlAsync(key);
        };
        return { increase, expire, get, reset, ttl };
    },
    isStoreActive: () => {
        return redisClient.connected;
    }
};