const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

router.get('/', adminController.getOverview);

router.get('/notices', adminController.getNotices);
router.post('/notices', adminController.createNotice);
router.post('/notices/:id/delete', adminController.deleteNotice);

router.get('/events', adminController.getEvents);
router.post('/events', adminController.createEvent);
router.post('/events/:id/delete', adminController.deleteEvent);

router.get('/users', adminController.getUsers);
router.post('/users/:id/toggle', adminController.toggleUserBlock);
router.post('/users/:id/delete', adminController.deleteUser);

router.get('/resources', adminController.getResources);
router.post('/resources/:id/approve', adminController.approveResource);
router.post('/resources/:id/reject', adminController.rejectResource);
router.post('/resources/:id/delete', adminController.deleteResource);

router.get('/community', adminController.getCommunity);
router.post('/community/:id/delete', adminController.deletePost);

router.get('/groups', adminController.getGroups);
router.post('/groups/:id/delete', adminController.deleteGroup);

router.get('/messages', adminController.getMessages);
router.post('/messages/:id/delete', adminController.deleteMessage);

router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.postSettings);

router.get('/logs', adminController.getLogs);
router.get('/export/:type', adminController.exportCSV);

module.exports = router;
