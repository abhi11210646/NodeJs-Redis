'use strict';

module.exports = (res, err) => {
    return res.status(429).send({
        success: false,
        error: {
            code: err.code,
            retryAfter:err.retryAfter,
            message: err.message
        }
    });
};
