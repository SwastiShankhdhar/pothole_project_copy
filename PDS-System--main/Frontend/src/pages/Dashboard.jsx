import { useState } from "react";
import Camera from "../components/Camera";
import MapComponent from "../components/Map";
import Header from "../components/Header";
// import MapWithMarkers from "../components/MapWithMarker";
// import LocationTracker from "../components/LocationTracker";
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
{/* <MapWithMarkers />  */}
      {/* RIGHT SIDE → MAP */}
      <div style={{ width: "50%" }}>
        <MapComponent markers={markers} />
      </div>

    </div>
    {/* <LocationTracker /> */}
    </>
  );
}

export default Dashboard;
