const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cameraController = require('../controllers/cameraController');

// All routes require authentication
router.use(auth);

// Detect pothole from camera image
router.post('/detect', cameraController.detectFromCamera);

// Stream detection (for continuous detection)
router.post('/stream-detect', cameraController.streamDetect);

module.exports = router;
