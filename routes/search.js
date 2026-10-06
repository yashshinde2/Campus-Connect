const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, searchController.getSearchResults);

module.exports = router;
