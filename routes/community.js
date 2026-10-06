const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, communityController.getFeed);
router.post('/', isAuthenticated, communityController.postCreate);
router.get('/create', isAuthenticated, communityController.getCreate);
router.post('/create', isAuthenticated, communityController.postCreate);
router.get('/:id', isAuthenticated, communityController.getPostDetail);
router.post('/:id/comment', isAuthenticated, communityController.postComment);
router.post('/:id/delete', isAuthenticated, communityController.deletePost);

module.exports = router;
