const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per window
    message: 'Too many login or signup attempts from this IP, please try again after 15 minutes.'
});

module.exports = { authLimiter };
