const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', isAuthenticated, resourcesController.getResources);
router.get('/upload', isAuthenticated, resourcesController.getUpload);
router.post('/upload', isAuthenticated, upload.single('file'), resourcesController.postUpload);
router.get('/:id/download', isAuthenticated, resourcesController.downloadResource);

module.exports = router;
