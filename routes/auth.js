const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middleware/auth');
const { signupValidation, loginValidation } = require('../middleware/validators');
const { authLimiter } = require('../middleware/rateLimiters');

router.get('/login', isGuest, authController.getLogin);
router.post('/login', isGuest, authLimiter, loginValidation, authController.postLogin);

router.get('/signup', isGuest, authController.getSignup);
router.post('/signup', isGuest, authLimiter, signupValidation, authController.postSignup);

router.get('/forgot', isGuest, authController.getForgot);
router.post('/forgot', isGuest, authLimiter, authController.postForgot);

router.get('/reset/:token', isGuest, authController.getReset);
router.post('/reset/:token', isGuest, authController.postReset);

router.all('/logout', isAuthenticated, authController.logout);

module.exports = router;
