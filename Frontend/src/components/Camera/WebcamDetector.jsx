import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { audioBeep } from '../../utils/audioBeep';

const WebcamDetector = ({ sessionId, onPotholeDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const { location, error: locationError } = useGeolocation();

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  // Capture and detect frame
  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image as base64
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
    
    // Get current location
    if (!location) return;
    
    try {
      // Send to Node.js backend
      const response = await fetch('http://localhost:5000/api/camera/stream-detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          imageBase64,
          latitude: location.lat,
          longitude: location.lng,
          sessionId
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.detection.detected) {
        setLastDetection(data.detection);
        setDetectionCount(prev => prev + 1);
        
        // Play beep sound based on severity
        if (data.detection.severity === 'critical') {
          audioBeep.playCritical();
        } else if (data.detection.severity === 'high') {
          audioBeep.playWarning();
        } else {
          audioBeep.play(1, 800, 200);
        }
        
        // Notify parent component
        if (onPotholeDetected) {
          onPotholeDetected({
            ...data.detection,
            location: { lat: location.lat, lng: location.lng }
          });
        }
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
  }, [isActive, location, sessionId, onPotholeDetected]);

  // Start detection interval
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        captureAndDetect();
      }, 1000); // Detect every second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, captureAndDetect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          borderRadius: '8px',
          border: isActive ? '3px solid #4CAF50' : '1px solid #ccc',
          transform: 'scaleX(-1)' // Mirror for selfie view
        }}
        playsInline
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Controls */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        {!isActive ? (
          <button
            onClick={startCamera}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📷 Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            style={{
              padding: '10px 20px',
              background: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ⏹️ Stop Camera
          </button>
        )}
      </div>
      
      {/* Detection Status */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '20px',
          fontSize: '12px'
        }}>
          🔍 Active | {detectionCount} detections
        </div>
      )}
      
      {locationError && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '5px', fontSize: '12px' }}>
          ⚠️ Location error: {locationError}
        </div>
      )}
      
      {lastDetection && lastDetection.detected && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: lastDetection.severity === 'critical' ? '#F44336' :
                     lastDetection.severity === 'high' ? '#FF9800' :
                     lastDetection.severity === 'medium' ? '#FFC107' : '#4CAF50',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          animation: 'pulse 0.5s'
        }}>
          ⚠️ Pothole Detected! Severity: {lastDetection.severity}
        </div>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.1); }
            100% { transform: translateX(-50%) scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default WebcamDetector;
