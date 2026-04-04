// import { useEffect, useRef } from "react";
// import { detectPothole } from "../services/api";

// const Camera = ({ updateMapLocation }) => {
//   const videoRef = useRef(null);

//   // 🎥 Start webcam
//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then((stream) => {
//         videoRef.current.srcObject = stream;
//       });
//   }, []);

//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => resolve({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude
//         }),
//         reject
//       );
//     });
//   };

//   // 🖼 Convert frame → base64
//   const captureFrame = () => {
//     const canvas = document.createElement("canvas");
//     const video = videoRef.current;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0);

//     return canvas.toDataURL("image/jpeg");
//   };

//   // 🚀 MAIN DETECTION LOOP
//   const runDetection = async () => {
//     try {
//       const location = await getLocation();
//       const image_base64 = captureFrame();

//       const res = await fetch("http://localhost:8000/api/detection/camera/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           latitude: location.lat,
//           longitude: location.lng,
//           image_base64: image_base64,
//         }),
//       });

//       const data = await res.json();

//       if (data.detected) {
//         updateMapLocation(location.lat, location.lng);
//       }

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(runDetection, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div style={{ width: "100%" }}>
//       <video ref={videoRef} autoPlay style={{ width: "100%" }} />
//     </div>
//   );
// };

// export default Camera;
import { useEffect, useRef } from "react";

const Camera = ({ updateMapLocation }) => {
  const videoRef = useRef(null);

  // 🎥 START CAMERA (ONLY ONCE)
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Camera error:", err);
      }
    };

    startCamera();
  }, []);

  // 📍 GET LOCATION ON LOAD (SEPARATE EFFECT)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        console.log("Initial location:", lat, lng);

        updateMapLocation(lat, lng); // only once
      },
      (err) => console.log("Location error:", err)
    );
  }, [updateMapLocation]);

  // 📍 GET LOCATION FUNCTION
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      // navigator.geolocation.getCurrentPosition(
      //   (pos) =>
      //     resolve({
      //       lat: pos.coords.latitude,
      //       lng: pos.coords.longitude,
      //     }),
      //   reject
      // );
      navigator.geolocation.getCurrentPosition(
  (pos) => {
    resolve({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
  },
  reject,
  {
    enableHighAccuracy: true,   // 🔥 IMPORTANT
    timeout: 10000,
    maximumAge: 0,
  }
);
    });
  };

  // 🖼 CAPTURE FRAME
  const captureFrame = () => {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg");
  };

  // 🚀 DETECTION LOOP
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const location = await getLocation();
        const image_base64 = captureFrame();

        if (!image_base64) return;

        const res = await fetch("http://localhost:8000/api/detection/camera/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: location.lat,
            longitude: location.lng,
            image_base64: image_base64,
          }),
        });

        const data = await res.json();

        console.log("Detection:", data);

        if (data.detected) {
          updateMapLocation(location.lat, location.lng);
        }
      } catch (err) {
        console.log(err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [updateMapLocation]);

  return (
    <div style={{ width: "100%" }}>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
    </div>
  );
};

export default Camera;