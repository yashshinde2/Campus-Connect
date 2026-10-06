const User = require('../models/User');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const ContactMessage = require('../models/ContactMessage');
const SiteSetting = require('../models/SiteSetting');
const ActivityLog = require('../models/ActivityLog');
const Report = require('../models/Report');
const exportToCSV = require('../utils/csvGenerator');

exports.getOverview = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const noticeCount = await Notice.countDocuments();
        const pendingResourceCount = await Resource.countDocuments({ status: 'pending' });
        const totalEventCount = await Event.countDocuments();

        const recentUsers = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5);
        const pendingResources = await Resource.find({ status: 'pending' }).populate('uploadedBy', 'name').limit(5);
        const recentReports = await Report.find({ status: 'open' }).populate('reportedBy', 'name').limit(5);

        res.render('admin/overview', {
            title: 'Admin Dashboard - Campus Connect',
            stats: { studentCount, noticeCount, pendingResourceCount, totalEventCount },
            recentUsers,
            pendingResources,
            recentReports
        });
    } catch (err) {
        console.error('Admin Overview Error:', err);
        req.flash('error_msg', 'Could not load admin overview.');
        res.redirect('/dashboard');
    }
};

// Notices Management
exports.getNotices = async (req, res) => {
    const notices = await Notice.find().sort({ createdAt: -1 }).populate('author', 'name');
    res.render('admin/notices', { title: 'Manage Notices - Admin', notices });
};

exports.createNotice = async (req, res) => {
    try {
        const { title, description, category, isPinned, isUrgent, deadline } = req.body;
        const notice = await Notice.create({
            title,
            description,
            category,
            isPinned: isPinned === 'on',
            isUrgent: isUrgent === 'on',
            deadline: deadline ? new Date(deadline) : null,
            author: req.session.user._id
        });

        // Notify active students
        const students = await User.find({ role: 'student', isActive: true }, '_id');
        const notifications = students.map(s => ({
            user: s._id,
            type: 'notice',
            message: `New Campus Notice: "${notice.title.substring(0, 40)}..."`,
            link: `/notices/${notice._id}`
        }));
        await Notification.insertMany(notifications);

        await ActivityLog.create({ admin: req.session.user._id, action: `Created notice "${notice.title}"`, targetType: 'Notice', targetId: notice._id.toString() });

        req.flash('success_msg', 'Notice published successfully and students notified!');
        res.redirect('/admin/notices');
    } catch (err) {
        req.flash('error_msg', 'Error creating notice.');
        res.redirect('/admin/notices');
    }
};

exports.deleteNotice = async (req, res) => {
    await Notice.findByIdAndDelete(req.params.id);
    await ActivityLog.create({ admin: req.session.user._id, action: `Deleted notice ${req.params.id}`, targetType: 'Notice', targetId: req.params.id });
    req.flash('success_msg', 'Notice deleted successfully.');
    res.redirect('/admin/notices');
};

// Events Management
exports.getEvents = async (req, res) => {
    const events = await Event.find().sort({ date: 1 }).populate('author', 'name');
    res.render('admin/events', { title: 'Manage Events - Admin', events });
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, category, date, time, venue, capacity } = req.body;
        const event = await Event.create({
            title,
            description,
            category: category || 'General',
            date: new Date(date),
            time,
            venue,
            capacity: parseInt(capacity) || 100,
            author: req.session.user._id
        });

        // Notify active students
        const students = await User.find({ role: 'student', isActive: true }, '_id');
        const notifications = students.map(s => ({
            user: s._id,
            type: 'event',
            message: `New Campus Event: "${event.title.substring(0, 40)}..."`,
            link: `/events/${event._id}`
        }));
        await Notification.insertMany(notifications);

        await ActivityLog.create({ admin: req.session.user._id, action: `Created event "${event.title}"`, targetType: 'Event', targetId: event._id.toString() });

        req.flash('success_msg', 'Event published successfully!');
        res.redirect('/admin/events');
    } catch (err) {
        req.flash('error_msg', 'Error creating event.');
        res.redirect('/admin/events');
    }
};

exports.deleteEvent = async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Event deleted.');
    res.redirect('/admin/events');
};

// Users Management
exports.getUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { title: 'User Management - Admin', users });
};

exports.toggleUserBlock = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.isActive = !user.isActive;
        await user.save();
        req.flash('success_msg', `User ${user.name} has been ${user.isActive ? 'unblocked' : 'blocked'}.`);
    }
    res.redirect('/admin/users');
};

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'User removed.');
    res.redirect('/admin/users');
};

// Resources Moderation
exports.getResources = async (req, res) => {
    const resources = await Resource.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email');
    res.render('admin/resources', { title: 'Resource Moderation - Admin', resources });
};

exports.approveResource = async (req, res) => {
    await Resource.findByIdAndUpdate(req.params.id, { status: 'approved' });
    req.flash('success_msg', 'Resource approved!');
    res.redirect('/admin/resources');
};

exports.rejectResource = async (req, res) => {
    const { reason } = req.body;
    await Resource.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionReason: reason || 'Does not meet guidelines' });
    req.flash('success_msg', 'Resource rejected.');
    res.redirect('/admin/resources');
};

exports.deleteResource = async (req, res) => {
    await Resource.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Resource deleted.');
    res.redirect('/admin/resources');
};

// Community Moderation
exports.getCommunity = async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'name');
    res.render('admin/community', { title: 'Community Moderation - Admin', posts });
};

exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    req.flash('success_msg', 'Post and its comments deleted.');
    res.redirect('/admin/community');
};

// Groups & Messages
exports.getGroups = async (req, res) => {
    const groups = await Group.find().populate('createdBy', 'name');
    res.render('admin/groups', { title: 'Groups Management - Admin', groups });
};

exports.deleteGroup = async (req, res) => {
    await Group.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Group deleted.');
    res.redirect('/admin/groups');
};

exports.getMessages = async (req, res) => {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.render('admin/messages', { title: 'Contact Messages - Admin', messages });
};

exports.deleteMessage = async (req, res) => {
    await ContactMessage.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Message deleted.');
    res.redirect('/admin/messages');
};

// Site Settings
exports.getSettings = async (req, res) => {
    const setting = await SiteSetting.findOne({ key: 'announcement' });
    res.render('admin/settings', { title: 'Site Settings - Admin', announcement: setting ? setting.value : {} });
};

exports.postSettings = async (req, res) => {
    const { enabled, text, type } = req.body;
    await SiteSetting.findOneAndUpdate(
        { key: 'announcement' },
        { value: { enabled: enabled === 'on', text, type: type || 'info' } },
        { upsert: true, new: true }
    );
    req.flash('success_msg', 'Site announcement updated!');
    res.redirect('/admin/settings');
};

// Activity Logs
exports.getLogs = async (req, res) => {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).populate('admin', 'name');
    res.render('admin/logs', { title: 'Activity Logs - Admin', logs });
};

// CSV Export
exports.exportCSV = async (req, res) => {
    const type = req.params.type;
    if (type === 'users') {
        const users = await User.find({ role: 'student' }).lean();
        const csv = exportToCSV(users, ['name', 'email', 'course', 'department', 'year', 'isActive']);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="campus_students.csv"');
        return res.send(csv);
    }
    res.status(400).send('Invalid export type');
};
