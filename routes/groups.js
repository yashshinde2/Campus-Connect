const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, groupsController.getGroups);
router.post('/', isAuthenticated, groupsController.postGroup);
router.get('/:id', isAuthenticated, groupsController.getGroupDetail);

module.exports = router;
