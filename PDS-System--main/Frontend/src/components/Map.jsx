
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix default Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: null,
});

// ✅ Get FULL address
const getAddressFromLatLng = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
      {
        headers: {
          "User-Agent": "MyAppName/1.0",
        },
      }
    );

    const data = await res.json();

    if (data.display_name) return data.display_name;

    return "Unknown location";
  } catch (err) {
    console.error("Geocoding error:", err);
    return "Unknown location";
  }
};

const MapComponent = ({ detectedPotholes }) => {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const potholeMarkersRef = useRef([]);

  // ✅ Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      center: [20.5937, 78.9629],
      zoom: 13,
      closePopupOnClick: false, // 🔥 IMPORTANT FIX
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    mapRef.current = map;
  }, []);

  // ✅ Live user location tracking
  // useEffect(() => {
  //   if (!navigator.geolocation || !mapRef.current) return;

  //   const watchId = navigator.geolocation.watchPosition(
  //     async (pos) => {
  //       const lat = pos.coords.latitude;
  //       const lng = pos.coords.longitude;

  //       const address = await getAddressFromLatLng(lat, lng);

  //       if (userMarkerRef.current) {
  //         userMarkerRef.current
  //           .setLatLng([lat, lng])
  //           .setPopupContent(`<b>You are here 📍</b><br>${address}`)
  //           .openPopup(); // 🔥 IMPORTANT FIX
  //       } else {
  //         userMarkerRef.current = L.marker([lat, lng])
  //           .addTo(mapRef.current)
  //           .bindPopup(`<b>You are here 📍</b><br>${address}`, {
  //             autoClose: false,   // 🔥 FIX
  //             closeOnClick: false // 🔥 FIX
  //           })
  //           .openPopup();
  //       }

  //       mapRef.current.setView([lat, lng], 16);
  //     },
  //     (err) => {
  //       if (err.code !== 3) console.error("Geolocation error:", err);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //       maximumAge: 0,
  //     }
  //   );

  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, []);

  // ✅ Add pothole markers
  useEffect(() => {
    if (!mapRef.current || !detectedPotholes) return;

    potholeMarkersRef.current.forEach((m) =>
      mapRef.current.removeLayer(m)
    );
    potholeMarkersRef.current = [];

    const addMarkers = async () => {
      for (const p of detectedPotholes) {
        const address = await getAddressFromLatLng(p.lat, p.lng);

        const marker = L.marker([p.lat, p.lng], {
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
          .bindPopup(`<b>Pothole detected 🚧</b><br>${address}`, {
            autoClose: false,
            closeOnClick: false,
          });

        potholeMarkersRef.current.push(marker);
      }
    };

    addMarkers();
  }, [detectedPotholes]);

  return (
  <div
    id="map"
    style={{
      height: "100%",   // 🔥 FIX
      width: "100%",
      borderRadius: "10px",
    }}
  ></div>

  );
};

export default MapComponent;