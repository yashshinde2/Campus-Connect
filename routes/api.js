const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/search', isAuthenticated, apiController.ajaxSearch);
router.post('/bookmark/:id', isAuthenticated, apiController.toggleBookmark);
router.post('/rsvp/:id', isAuthenticated, apiController.toggleRSVP);

module.exports = router;
