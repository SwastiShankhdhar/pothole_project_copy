
// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix default Leaflet marker
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: null,
// });

// // Helper: reverse geocode
// const getAddressFromLatLng = async (lat, lng) => {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//     );
//     const data = await res.json();
//     return data.display_name || "Unknown location";
//   } catch {
//     return "Unknown location";
//   }
// };

// const MapComponent = ({ detectedPotholes }) => {
//   const mapRef = useRef(null);
//   const currentMarkerRef = useRef(null);

//   // Initialize Leaflet map once
//   useEffect(() => {
//     if (mapRef.current) return; // prevent re-initialization

//     const map = L.map("map", {
//       center: [20.5937, 78.9629], // fallback center (India)
//       zoom: 13,
//     });

//     L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
//     }).addTo(map);

//     mapRef.current = map;
//   }, []);

//   // Track user location
//   useEffect(() => {
//     if (!navigator.geolocation || !mapRef.current) return;

//     const watchId = navigator.geolocation.watchPosition(
//       async (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;
//         const address = await getAddressFromLatLng(lat, lng);

//         // Add or update marker for current location
//         if (currentMarkerRef.current) {
//           currentMarkerRef.current.setLatLng([lat, lng]);
//         } else {
//           currentMarkerRef.current = L.marker([lat, lng])
//             .addTo(mapRef.current)
//             .bindPopup(`You are here 📍<br>${address}`)
//             .openPopup();
//         }

//         mapRef.current.setView([lat, lng], 16);
//       },
//       (err) => console.error(err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   // Add pothole markers
//   useEffect(() => {
//     if (!mapRef.current || !detectedPotholes) return;

//     const addPotholesMarkers = async () => {
//       for (const p of detectedPotholes) {
//         const address = await getAddressFromLatLng(p.lat, p.lng);
//         L.marker([p.lat, p.lng], {
//           icon: new L.Icon({
//             iconUrl:
//               "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
//             iconSize: [20, 20],
//             iconAnchor: [10, 10],
//             popupAnchor: [0, -10],
//             shadowUrl: null,
//           }),
//         })
//           .addTo(mapRef.current)
//           .bindPopup(`Pothole detected at: ${address}`);
//       }
//     };

//     addPotholesMarkers();
//   }, [detectedPotholes]);

//   return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
// };

// export default MapComponent;
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: null,
});

// Safe reverse geocoding helper
const getAddressFromLatLng = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch {
    return "Unknown location"; // fail silently
  }
};

const MapComponent = ({ detectedPotholes }) => {
  const mapRef = useRef(null);
  const currentMarkerRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      center: [20.5937, 78.9629],
      zoom: 13,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mapRef.current = map;
  }, []);

  // Track user location safely
  useEffect(() => {
    if (!navigator.geolocation || !mapRef.current) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Add/update current location marker
        if (currentMarkerRef.current) {
          currentMarkerRef.current.setLatLng([lat, lng]);
        } else {
          const address = await getAddressFromLatLng(lat, lng);
          currentMarkerRef.current = L.marker([lat, lng])
            .addTo(mapRef.current)
            .bindPopup(`You are here 📍<br>${address}`)
            .openPopup();
        }

        mapRef.current.setView([lat, lng], 16);
      },
      (err) => {
        // Ignore TIMEOUT errors (code 3)
        if (err.code !== 3) console.error(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10s to avoid repeated timeout errors
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Add pothole markers safely
  useEffect(() => {
    if (!mapRef.current || !detectedPotholes) return;

    const addPotholesMarkers = async () => {
      for (const p of detectedPotholes) {
        const address = await getAddressFromLatLng(p.lat, p.lng);
        L.marker([p.lat, p.lng], {
          icon: new L.Icon({
            iconUrl:
              "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
            shadowUrl: null,
          }),
        })
          .addTo(mapRef.current)
          .bindPopup(`Pothole detected at: ${address}`);
      }
    };

    addPotholesMarkers();
  }, [detectedPotholes]);

  return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
};

export default MapComponent;