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
  <Header/>
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDE → CAMERA */}
      <div style={{ width: "50%" }}>
        <Camera updateMapLocation={updateMapLocation} />
      </div>

      {/* RIGHT SIDE → MAP */}
      <div style={{ width: "50%" }}>
        <MapComponent markers={markers} />
      </div>

    </div>
    </>
  );
}

export default Dashboard;