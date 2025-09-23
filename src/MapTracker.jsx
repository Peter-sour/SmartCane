import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaArrowLeft, FaRedo } from "react-icons/fa"; // ⬅️ tambah icon refresh

function MapsTracker() {
  const history = useHistory();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map("map").setView([0, 0], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // ambil lokasi awal
    getLocation();

    return () => {
      map.remove();
    };
  }, []);

  const getLocation = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;

        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        } else {
          markerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current)
            .bindPopup("📍 Lokasi Kamu")
            .openPopup();
        }

        mapRef.current.setView([latitude, longitude], 16);
      });
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Map */}
      <div id="map" className="h-full w-full" />

      {/* Tombol kembali */}
      <button
        onClick={() => history.push("/dasboard")}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 
                   flex items-center gap-2
                   bg-blue-600 text-white px-6 py-3 rounded-full 
                   shadow-lg hover:bg-blue-700 transition z-[9999]"
      >
        <FaArrowLeft /> Kembali
      </button>

      {/* Tombol refresh lokasi (tengah atas) */}
      <button
        onClick={getLocation}
        className="fixed top-6 left-1/2 -translate-x-1/2
                   flex items-center justify-center
                   bg-green-600 text-white w-12 h-12 rounded-full 
                   shadow-lg hover:bg-green-700 transition z-[9999]"
      >
        <FaRedo />
      </button>
    </div>
  );
}

export default MapsTracker;
