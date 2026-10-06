const User = require('../models/User');
const Post = require('../models/Post');
const Resource = require('../models/Resource');
const Event = require('../models/Event');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate('bookmarks.item');
        const myPosts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
        const myUploads = await Resource.find({ uploadedBy: user._id }).sort({ createdAt: -1 });
        const myRSVPs = await Event.find({ attendees: user._id }).sort({ date: 1 });

        res.render('profile/index', {
            title: 'My Profile - Campus Connect',
            profile: user,
            myPosts,
            myUploads,
            myRSVPs
        });
    } catch (err) {
        console.error('getProfile Error:', err);
        req.flash('error_msg', 'Could not load profile.');
        res.redirect('/dashboard');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, course, department, year, semester, bio } = req.body;
        const user = await User.findById(req.session.user._id);

        if (name) user.name = name;
        if (course) user.course = course;
        if (department) user.department = department;
        if (year) user.year = parseInt(year);
        if (semester) user.semester = parseInt(semester);
        if (bio !== undefined) user.bio = bio;

        if (req.file) {
            user.avatar = '/uploads/avatars/' + req.file.filename;
        }

        await user.save();

        req.session.user.name = user.name;
        req.session.user.course = user.course;
        req.session.user.department = user.department;
        req.session.user.avatar = user.avatar;

        req.flash('success_msg', 'Profile updated successfully!');
        res.redirect('/profile');
    } catch (err) {
        console.error('updateProfile Error:', err);
        req.flash('error_msg', 'Could not update profile.');
        res.redirect('/profile');
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        if (newPassword !== confirmNewPassword) {
            req.flash('error_msg', 'New passwords do not match.');
            return res.redirect('/profile');
        }

        const user = await User.findById(req.session.user._id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Current password is incorrect.');
            return res.redirect('/profile');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        req.flash('success_msg', 'Password updated successfully!');
        res.redirect('/profile');
    } catch (err) {
        console.error('changePassword Error:', err);
        req.flash('error_msg', 'Error changing password.');
        res.redirect('/profile');
    }
};

exports.getPublicProfile = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            req.flash('error_msg', 'Student profile not found.');
            return res.redirect('/dashboard');
        }

        const studentPosts = await Post.find({ author: student._id }).sort({ createdAt: -1 });
        const studentResources = await Resource.find({ uploadedBy: student._id, status: 'approved' });

        res.render('profile/view', {
            title: `${student.name} - Student Profile`,
            student,
            studentPosts,
            studentResources
        });
    } catch (err) {
        req.flash('error_msg', 'Error loading student profile.');
        res.redirect('/dashboard');
    }
};
