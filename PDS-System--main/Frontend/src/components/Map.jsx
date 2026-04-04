
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// const MapComponent = ({ markers }) => {

//   const center = markers.length > 0
//     ? markers[markers.length - 1]
//     : [20.5937, 78.9629];

//   return (
//     <MapContainer
//       center={center}
//       zoom={15}
//       style={{ height: "100vh", width: "100%" }}
//     >
//       <TileLayer
//         attribution="&copy; OpenStreetMap"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {markers.map((m, i) => (
//         <Marker key={i} position={[m.lat, m.lng]}>
//           <Popup>Pothole detected here</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default MapComponent;
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ FIX marker icon issue (VERY IMPORTANT)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = ({ markers }) => {

  const center = markers.length > 0
    ? [markers[markers.length - 1].lat, markers[markers.length - 1].lng]
    : [20.5937, 78.9629];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]}>
          <Popup>Pothole detected here</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;