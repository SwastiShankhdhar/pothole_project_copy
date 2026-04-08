// import { useState } from "react";
// import Camera from "../components/Camera";
// import MapComponent from "../components/Map";
// import Header from "../components/Header";
// // import MapWithMarkers from "../components/MapWithMarker";
// // import LocationTracker from "../components/LocationTracker";
// function Dashboard() {
//   const [markers, setMarkers] = useState([]);

//   const updateMapLocation = (lat, lng) => {
//     setMarkers((prev) => [...prev, { lat, lng }]);
//   };

//   return (
//   <>
//   <Header/>
//     <div style={{ display: "flex", height: "100vh" }}>
      
//       {/* LEFT SIDE → CAMERA */}
//       <div style={{ width: "50%" }}>
//         <Camera updateMapLocation={updateMapLocation} />
//       </div>
// {/* <MapWithMarkers />  */}
//       {/* RIGHT SIDE → MAP */}
//       <div style={{ width: "50%" }}>
//         <MapComponent markers={markers} />
//       </div>

//     </div>
//     {/* <LocationTracker /> */}
//     </>
//   );
// }

// export default Dashboard;
import { useState } from "react";
import Camera from "../components/Camera";
import MapComponent from "../components/Map";
import Header from "../components/Header";

function Dashboard() {
  const [markers, setMarkers] = useState([]);

  const updateMapLocation = (lat, lng) => {
    setMarkers((prev) => [...prev, { lat, lng }]);
  };

  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          gap: "20px", // 🔥 GAP between camera & map
          padding: "20px",
          height: "calc(100vh - 70px)",
          background: "#f5f7fa", // light background
        }}
      >
        {/* LEFT → CAMERA */}
        <div
          style={{
            width: "50%",
            background: "#fff",
            borderRadius: "12px",
            padding: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>📷 Live Camera</h3>
          <Camera updateMapLocation={updateMapLocation} />
        </div>

        {/* RIGHT → MAP */}
        <div
          style={{
            width: "50%",
            background: "#fff",
            borderRadius: "12px",
            padding: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>🗺️ Live Map</h3>
          <div style={{ flex: 1 }}>
            <MapComponent detectedPotholes={markers} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;