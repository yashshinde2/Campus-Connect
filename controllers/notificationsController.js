const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.session.user._id })
            .sort({ createdAt: -1 });

        res.render('notifications/index', {
            title: 'Notifications - Campus Connect',
            notifications
        });
    } catch (err) {
        console.error('getNotifications Error:', err);
        req.flash('error_msg', 'Could not load notifications.');
        res.redirect('/dashboard');
    }
};

exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.session.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        req.flash('success_msg', 'All notifications marked as read.');
        res.redirect('/notifications');
    } catch (err) {
        req.flash('error_msg', 'Could not update notifications.');
        res.redirect('/notifications');
    }
};
