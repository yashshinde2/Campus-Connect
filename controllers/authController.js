const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render('auth/login', { title: 'Sign In - Campus Connect' });
};

exports.postLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/auth/login');
    }

    const { email, password, remember } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('error_msg', 'Invalid credentials.');
            return res.redirect('/auth/login');
        }

        if (!user.isActive) {
            req.flash('error_msg', 'Your account has been deactivated. Please contact administration.');
            return res.redirect('/auth/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid credentials.');
            return res.redirect('/auth/login');
        }

        user.lastLogin = new Date();
        await user.save();

        req.session.user = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            course: user.course,
            department: user.department,
            avatar: user.avatar,
            isActive: user.isActive
        };

        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }

        req.flash('success_msg', `Welcome back, ${user.name}!`);
        const redirectUrl = req.session.returnTo || (user.role === 'admin' ? '/admin' : '/dashboard');
        delete req.session.returnTo;

        req.session.save((err) => {
            if (err) console.error('Session save error:', err);
            res.redirect(redirectUrl);
        });
    } catch (err) {
        console.error('Login error:', err);
        req.flash('error_msg', 'An error occurred during sign in.');
        res.redirect('/auth/login');
    }
};

exports.getSignup = (req, res) => {
    res.render('auth/signup', { title: 'Create Account - Campus Connect' });
};

exports.postSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/auth/signup');
    }

    const { name, email, password, course, department, year, semester, bio } = req.body;
    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            req.flash('error_msg', 'Email address is already registered.');
            return res.redirect('/auth/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            course,
            department,
            year: year || 1,
            semester: semester || 1,
            bio: bio || '',
            role: 'student'
        });

        req.session.user = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            course: user.course,
            department: user.department,
            avatar: user.avatar,
            isActive: user.isActive
        };

        req.flash('success_msg', 'Account created successfully! Welcome to Campus Connect.');
        req.session.save((err) => {
            if (err) console.error('Session save error:', err);
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error('Signup error:', err);
        req.flash('error_msg', 'An error occurred during account creation.');
        res.redirect('/auth/signup');
    }
};

exports.getForgot = (req, res) => {
    res.render('auth/forgot', { title: 'Forgot Password - Campus Connect' });
};

exports.postForgot = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('success_msg', 'If that email exists, a password reset link has been generated.');
            return res.redirect('/auth/forgot');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        user.resetTokenHash = tokenHash;
        user.resetTokenExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://${req.headers.host}/auth/reset/${token}`;
        console.log('\n==================================================');
        console.log(`[PASSWORD RESET LINK]: ${resetLink}`);
        console.log('==================================================\n');

        req.flash('success_msg', 'Password reset link has been logged to the server console!');
        res.redirect('/auth/forgot');
    } catch (err) {
        console.error('Forgot error:', err);
        req.flash('error_msg', 'An error occurred.');
        res.redirect('/auth/forgot');
    }
};

exports.getReset = async (req, res) => {
    const { token } = req.params;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetTokenHash: tokenHash,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error_msg', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot');
        }

        res.render('auth/reset', { title: 'Reset Password', token });
    } catch (err) {
        req.flash('error_msg', 'Error verifying reset token.');
        res.redirect('/auth/forgot');
    }
};

exports.postReset = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match.');
        return res.redirect(`/auth/reset/${token}`);
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    try {
        const user = await User.findOne({
            resetTokenHash: tokenHash,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error_msg', 'Token is invalid or expired.');
            return res.redirect('/auth/forgot');
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetTokenHash = null;
        user.resetTokenExpires = null;
        await user.save();

        req.flash('success_msg', 'Password reset successful! You can now log in with your new password.');
        res.redirect('/auth/login');
    } catch (err) {
        req.flash('error_msg', 'Error resetting password.');
        res.redirect('/auth/forgot');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.redirect('/auth/login');
    });
};
