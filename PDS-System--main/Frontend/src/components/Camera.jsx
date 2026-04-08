
import { useEffect, useRef, useState } from "react";

function Camera({ updateMapLocation }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // ▶️ Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // ⛔ Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  // 🔥 Detect Pothole (NEW FEATURE)
  // const detectPothole = () => {
  //   alert("⚠️ Pothole Detected!");

  //   navigator.geolocation.getCurrentPosition((pos) => {
  //     const lat = pos.coords.latitude;
  //     const lng = pos.coords.longitude;

  //     updateMapLocation(lat, lng); // 📍 send to map
  //   });
  // };

const detectPothole = () => {
  alert("⚠️ Pothole Detected! Click OK to mark location");

  setTimeout(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        updateMapLocation(lat, lng); // 📍 AFTER alert
      },
      (err) => {
        console.error(err);
        alert("Location permission denied");
      }
    );
  }, 200); // 🔥 small delay (IMPORTANT)
};

  // Auto start
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div
      style={{
        background: "#000",
        borderRadius: "10px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* 🎥 Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* 🔘 Controls */}
      <div
        style={{
          padding: "10px",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {!isCameraOn ? (
          <button onClick={startCamera} style={buttonStyle("#28a745")}>
            ▶ Start
          </button>
        ) : (
          <>
            <button onClick={stopCamera} style={buttonStyle("#dc3545")}>
              ⛔ Stop
            </button>

            {/* 🔥 NEW Detect Button */}
            <button onClick={detectPothole} style={buttonStyle("#ffc107")}>
              ⚠️ Detect
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// 🎨 Button style
const buttonStyle = (bg) => ({
  background: bg,
  color: "#000",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
});

export default Camera;
