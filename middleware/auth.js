const Notification = require('../models/Notification');
const SiteSetting = require('../models/SiteSetting');

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.isActive === false) {
            req.session.destroy();
            if (req.session && typeof req.flash === 'function') req.flash('error_msg', 'Your account has been deactivated.');
            return res.redirect('/auth/login');
        }
        return next();
    }
    if (req.session) {
        req.session.returnTo = req.originalUrl;
        if (typeof req.flash === 'function') req.flash('error_msg', 'Please log in to access this page.');
    }
    res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    if (req.session && typeof req.flash === 'function') req.flash('error_msg', 'Access denied. Administrator privileges required.');
    res.redirect('/dashboard');
};

const isGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
};

const attachUser = async (req, res, next) => {
    res.locals.user = req.session ? req.session.user || null : null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.unreadCount = 0;
    res.locals.siteBanner = null;

    try {
        if (res.locals.user) {
            res.locals.unreadCount = await Notification.countDocuments({
                user: res.locals.user._id,
                isRead: false
            });
        }
        const bannerSetting = await SiteSetting.findOne({ key: 'announcement' });
        if (bannerSetting && bannerSetting.value && bannerSetting.value.enabled) {
            res.locals.siteBanner = bannerSetting.value;
        }
    } catch (err) {
        console.error('attachUser Middleware Error:', err);
    }
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isGuest,
    attachUser
};
