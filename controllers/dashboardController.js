const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            req.session.destroy();
            return res.redirect('/auth/login');
        }

        // Quick Stats
        const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
        const upcomingEventsCount = await Event.countDocuments({ date: { $gte: new Date() } });
        const myBookmarksCount = currentUser.bookmarks ? currentUser.bookmarks.length : 0;
        const myUploadsCount = await Resource.countDocuments({ uploadedBy: userId });

        // Latest Notices (Pinned & Urgent first)
        const notices = await Notice.find()
            .sort({ isPinned: -1, isUrgent: -1, createdAt: -1 })
            .limit(5)
            .populate('author', 'name');

        // Upcoming Events
        const events = await Event.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .limit(4);

        // Deadlines (Notices with deadline >= today)
        const deadlines = await Notice.find({
            deadline: { $gte: new Date() }
        }).sort({ deadline: 1 }).limit(3);

        // Study Hub Highlights
        const topResources = await Resource.find({ status: 'approved' })
            .sort({ downloads: -1, likes: -1 })
            .limit(3)
            .populate('uploadedBy', 'name');

        // Community Highlights
        const topPosts = await Post.find()
            .sort({ commentCount: -1, createdAt: -1 })
            .limit(3)
            .populate('author', 'name');

        // Calculate Profile Completion %
        let profileFields = [currentUser.name, currentUser.email, currentUser.course, currentUser.department, currentUser.year, currentUser.bio, currentUser.avatar];
        let filledFields = profileFields.filter(f => f && f !== '' && f !== '/images/default-avatar.png').length;
        let completionPercent = Math.round((filledFields / profileFields.length) * 100);

        res.render('dashboard/index', {
            title: 'Student Dashboard - Campus Connect',
            stats: { unreadCount, upcomingEventsCount, myBookmarksCount, myUploadsCount },
            notices,
            events,
            deadlines,
            topResources,
            topPosts,
            completionPercent,
            userProfile: currentUser
        });
    } catch (err) {
        console.error('Dashboard Controller Error Stack:', err.stack || err);
        if (req.session && typeof req.flash === 'function') req.flash('error_msg', 'Could not load dashboard data.');
        res.redirect('/');
    }
};
