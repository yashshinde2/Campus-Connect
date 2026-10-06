const User = require('../models/User');
const Notice = require('../models/Notice');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const ContactMessage = require('../models/ContactMessage');

exports.getLanding = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const noticeCount = await Notice.countDocuments();
        const resourceCount = await Resource.countDocuments({ status: 'approved' });
        const eventCount = await Event.countDocuments();

        res.render('public/landing', {
            title: 'Campus Connect - Your Campus, All In One Place',
            stats: { studentCount, noticeCount, resourceCount, eventCount }
        });
    } catch (err) {
        console.error('Landing page error:', err);
        res.render('public/landing', {
            title: 'Campus Connect',
            stats: { studentCount: 500, noticeCount: 120, resourceCount: 340, eventCount: 45 }
        });
    }
};

exports.getAbout = (req, res) => {
    res.render('public/about', { title: 'About Us - Campus Connect' });
};

exports.getContact = (req, res) => {
    res.render('public/contact', { title: 'Contact Us - Campus Connect' });
};

exports.postContact = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        await ContactMessage.create({ name, email, subject, message });
        req.flash('success_msg', 'Your message has been sent successfully! Our administration team will review it.');
        res.redirect('/contact');
    } catch (err) {
        console.error('Contact submit error:', err);
        req.flash('error_msg', 'Could not send message. Please try again.');
        res.redirect('/contact');
    }
};

exports.getStyleguide = (req, res) => {
    res.render('public/styleguide', { title: 'Component Styleguide & UI Library' });
};
