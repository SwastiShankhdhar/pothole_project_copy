const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Django backend URL
const DJANGO_URL = process.env.DJANGO_URL || 'http://localhost:8000';

// Process camera frame for pothole detection
exports.detectFromCamera = async (req, res) => {
  try {
    const { imageBase64, latitude, longitude, sessionId } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Convert base64 to buffer
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Create temp file
    const tempPath = `/tmp/pothole_${Date.now()}.jpg`;
    fs.writeFileSync(tempPath, imageBuffer);
    
    // Send to Django backend for YOLO detection
    const formData = new FormData();
    formData.append('image', fs.createReadStream(tempPath));
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('sessionId', sessionId || '');
    
    const response = await axios.post(`${DJANGO_URL}/api/detect/`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 10000, // 10 second timeout
    });
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    // Send response back to frontend
    res.json({
      success: true,
      detection: response.data
    });
    
  } catch (error) {
    console.error('Detection error:', error);
    
    // Clean up temp file if exists
    if (error.config?.data?.path) {
      try {
        fs.unlinkSync(error.config.data.path);
      } catch(e) {}
    }
    
    res.status(500).json({
      success: false,
      error: 'Detection failed',
      details: error.message
    });
  }
};

// Stream detection (for continuous detection)
exports.streamDetect = async (req, res) => {
  try {
    const { imageBase64, latitude, longitude, sessionId } = req.body;
    
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const tempPath = `/tmp/pothole_${Date.now()}.jpg`;
    fs.writeFileSync(tempPath, imageBuffer);
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(tempPath));
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('sessionId', sessionId || '');
    
    const response = await axios.post(`${DJANGO_URL}/api/detect-stream/`, formData, {
      headers: formData.getHeaders(),
      timeout: 5000,
    });
    
    fs.unlinkSync(tempPath);
    
    res.json({
      success: true,
      detection: response.data
    });
    
  } catch (error) {
    console.error('Stream detection error:', error);
    res.status(500).json({ success: false, error: 'Detection failed' });
  }
};
