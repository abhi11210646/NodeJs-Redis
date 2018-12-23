'use strict';

const redis = require('redis');

const retryStrategy = function (options) {
    if (options.error && (options.error.code === 'ECONNREFUSED' || options.error.code === 'NR_CLOSED')) {
        // Try reconnecting after 10 seconds
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        if (options.attempt > 3) { return new Error('The server refused the connection'); }

        console.error('The server refused the connection. Retrying connection...');
        return 10000;
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands with an individual error
        return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
};

const redisUrl = process.env.REDIS_URL || '';
let client = redis.createClient(redisUrl, { retry_strategy: retryStrategy });

const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on('error', err => console.log('Redis error ' + err));

client.on('connect', () => console.log('connected to redis'));

client.on('reconnecting', () => console.log('reconnecting to redis'));

module.exports = client;
