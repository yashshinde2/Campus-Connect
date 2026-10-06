const express = require('express');
const router = express.Router();
const noticesController = require('../controllers/noticesController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, noticesController.getNotices);
router.get('/:id', isAuthenticated, noticesController.getNoticeDetail);

module.exports = router;
