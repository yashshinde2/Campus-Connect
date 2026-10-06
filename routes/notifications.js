const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, notificationsController.getNotifications);
router.post('/mark-all', isAuthenticated, notificationsController.markAllRead);

module.exports = router;
