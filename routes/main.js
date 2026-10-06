const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.getLanding);
router.get('/about', mainController.getAbout);
router.get('/contact', mainController.getContact);
router.post('/contact', mainController.postContact);
router.get('/styleguide', mainController.getStyleguide);

module.exports = router;
