// import { MapContainer, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-400">

//       {/* Top Header */}
//       <div className="bg-white shadow px-6 py-4">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Gurgaon Road Monitoring
//         </h1>
//         <p className="text-sm text-gray-600">
//           Live pothole detection dashboard
//         </p>
//       </div>

//       {/* Map Section */}
//       <div className="flex-1 flex justify-center items-center p-6">

//         {/* TRUE SQUARE MAP */}
//         <div className="w-[70vh] h-[70vh] bg-white rounded-xl shadow-lg overflow-hidden">

//           <MapContainer
//             center={[28.4595, 77.0266]}
//             zoom={12}
//             style={{ height: "100%", width: "100%" }}
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution="&copy; OpenStreetMap contributors"
//             />
//           </MapContainer>

//         </div>

//       </div>

//     {/* Risk Section */}
// <div className="bg-gray-50 border-t px-10 py-10 mt-6">

//   <div className="max-w-4xl mx-auto">

//     <h2 className="text-2xl font-bold text-gray-900 mb-6">
//       Risk Level Guide
//     </h2>

//     <div className="grid sm:grid-cols-3 gap-8 text-base text-gray-700">

//       <div className="flex items-center gap-3">
//         <span className="h-5 w-5 rounded-full bg-red-500"></span>
//         <span className="font-semibold">High Risk</span>
//       </div>

//       <div className="flex items-center gap-3">
//         <span className="h-5 w-5 rounded-full bg-yellow-400"></span>
//         <span className="font-semibold">Moderate</span>
//       </div>

//       <div className="flex items-center gap-3">
//         <span className="h-5 w-5 rounded-full bg-green-500"></span>
//         <span className="font-semibold">Safe</span>
//       </div>

//     </div>

//     <p className="text-base text-gray-600 mt-6 leading-relaxed">
//       Red indicates severely damaged roads requiring immediate action.
//       Yellow indicates moderate caution areas.
//       Green indicates safe and well-maintained roads.
//     </p>

//   </div>

// </div>

//     </div>
//   );
// }
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-200">

      {/* Header */}
      <div className="bg-white shadow px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Gurgaon Road Monitoring
        </h1>
        <p className="text-sm text-gray-600">
          Live pothole detection dashboard
        </p>
      </div>

      {/* Main Content: Left + Right */}
      <div className="flex flex-col lg:flex-row gap-6 p-6">

        {/* ===== Left: Map ===== */}
        <div className="flex-1">

          <div className="w-full h-[70vh] bg-white rounded-xl shadow-lg overflow-hidden">

            <MapContainer
              center={[28.4595, 77.0266]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
            </MapContainer>

          </div>

        </div>

        {/* ===== Right: Risk Section ===== */}
        <div className="w-full lg:w-[350px]">

          <div className="bg-white rounded-xl shadow-lg p-8 h-[70vh] flex flex-col justify-between">

            <div>

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Risk Level Guide
              </h2>

              <div className="space-y-5 text-gray-700 text-base">

                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-full bg-red-500"></span>
                  <span className="font-medium">High Risk</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-full bg-yellow-400"></span>
                  <span className="font-medium">Moderate</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-full bg-green-500"></span>
                  <span className="font-medium">Safe</span>
                </div>

              </div>

            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              This guide helps identify road conditions in Gurgaon.
              Red shows severe damage, yellow indicates caution,
              and green represents safe roads.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}