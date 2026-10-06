const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', isAuthenticated, profileController.getProfile);
router.post('/', isAuthenticated, upload.single('avatar'), profileController.updateProfile);
router.post('/password', isAuthenticated, profileController.changePassword);
router.get('/users/:id', isAuthenticated, profileController.getPublicProfile);

module.exports = router;
