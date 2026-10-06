const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, eventsController.getEvents);
router.get('/:id', isAuthenticated, eventsController.getEventDetail);
router.get('/:id/ics', isAuthenticated, eventsController.downloadICS);

module.exports = router;
