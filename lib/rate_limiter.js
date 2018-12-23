const loginAttemps = require('./rate_limiter.helper');
const tooManyRequests = require('./429.js');
module.exports = (params = {}) => {
    return async (req, res, next) => {
        if (!loginAttemps.isStoreActive()) {
            console.log('Skipping Rate Limitting middleware as redis is not up and running!');
            return next();
        }
        const clientIP = ((req.headers['x-forwarded-for'] || '').split(',').pop() || req.connection.remoteAddress);
        let key = `${(clientIP == '::1' || clientIP == '::ffff:127.0.0.1') ? '127.0.0.1' : clientIP}`;
        let defaults = {
            allowedAttempts: 10,
            timeFrame: 10 * 60, // in sec
            key: key,
            message: 'Too Many Requests. Please try after sometimes!'
        };
        try {
            let options = Object.assign({}, defaults, params, req.rate_limit || {});
            options.key = 'Rate_Limit_' + options.key;
            const attempts = await loginAttemps.for(options.key).get();
            if (attempts >= options.allowedAttempts) {
                let err = new Error();
                err.code = 'HTTP_TOO_MANY_REQUESTS';
                err.message = options.message;
                return tooManyRequests(res, err);
            }
            req.rateLimit = async () => {
                const attempts = await loginAttemps.for(options.key).increase();
                if (attempts === 1) {
                    await loginAttemps.for(options.key).expire(options.timeFrame);
                }
                return (options.allowedAttempts - attempts);
            };
            next();
        } catch (err) {
            console.log('Skipping Rate Limitting middleware due to error: ', err);
            next();
        }
    };
};