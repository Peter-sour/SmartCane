import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw, MapPin, Navigation, Zap } from "lucide-react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";

function MapsTracker() {
  const history = useHistory();
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Cleanup existing map first
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const loadLeaflet = () => {
      if (window.L && mapRef.current) {
        initializeMap();
      } else if (!window.L) {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
          document.head.appendChild(leafletCSS);
        }

        // Load Leaflet JS
        if (!document.querySelector('script[src*="leaflet"]')) {
          const leafletScript = document.createElement('script');
          leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
          leafletScript.onload = () => {
            setTimeout(initializeMap, 100); // Small delay to ensure CSS is loaded
          };
          document.head.appendChild(leafletScript);
        }
      }
    };

    const timer = setTimeout(loadLeaflet, 100);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    try {
      // Remove existing map if any
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      // Clear the map container
      mapRef.current.innerHTML = '';

      // Initialize map
      const map = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        center: [-6.2088, 106.8456], // Jakarta default
        zoom: 13
      });

      leafletMapRef.current = map;

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Add custom zoom control
      window.L.control.zoom({
        position: 'topright'
      }).addTo(map);

      setIsMapReady(true);

      // Get location after map is ready
      setTimeout(() => {
        getLocation();
      }, 500);

    } catch (error) {
      console.error('Error initializing map:', error);
      setLocationError("Gagal menginisialisasi peta");
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation || !leafletMapRef.current) {
      setLocationError("Geolocation tidak didukung atau peta belum siap");
      return;
    }

    setIsLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (leafletMapRef.current) {
          // Remove existing marker
          if (markerRef.current) {
            leafletMapRef.current.removeLayer(markerRef.current);
          }

          // Create simple marker (avoid custom HTML for now)
          markerRef.current = window.L.marker([latitude, longitude])
            .addTo(leafletMapRef.current)
            .bindPopup('📍 Lokasi Anda')
            .openPopup();

          // Set view
          leafletMapRef.current.setView([latitude, longitude], 16);

          // Add accuracy circle
          window.L.circle([latitude, longitude], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            radius: accuracy || 100
          }).addTo(leafletMapRef.current);
        }

        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Akses lokasi ditolak. Silakan izinkan akses lokasi.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Lokasi tidak tersedia");
            break;
          case error.TIMEOUT:
            setLocationError("Request timeout");
            break;
          default:
            setLocationError("Terjadi kesalahan saat mengambil lokasi");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleBack = () => {
    history.push("/Dasboard");
    // Add your navigation logic here
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Inline Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .glassmorphism {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .custom-button {
            transition: all 0.3s ease;
          }

          .custom-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          }

          .custom-button:active {
            transform: translateY(0);
          }

          .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }

          .leaflet-control-zoom a {
            background: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #374151 !important;
            font-weight: bold !important;
            transition: all 0.2s ease !important;
          }

          .leaflet-control-zoom a:hover {
            background: rgba(255, 255, 255, 1) !important;
            transform: scale(1.05) !important;
          }

          .pulse {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }

          .loading-spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />

      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="glassmorphism p-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMapReady ? 'bg-green-500 pulse' : 'bg-yellow-500'}`}></div>
            <span className="text-gray-700 font-medium">
              {!isMapReady ? "Memuat peta..." : isLoading ? "Mencari lokasi..." : "Lokasi aktif"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Navigation size={14} />
            <span className="text-xs">GPS</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {locationError && (
        <div className="absolute top-20 left-4 right-4 z-[1000]">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <span className="text-sm">{locationError}</span>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-3">
          {/* Refresh Location Button */}
          <button
            onClick={getLocation}
            disabled={isLoading || !isMapReady}
            className="glassmorphism custom-button w-14 h-14 rounded-full flex items-center justify-center
                     text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw
              size={20}
              className={`${isLoading ? 'loading-spinner' : ''}`}
            />
          </button>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="glassmorphism custom-button px-6 py-3 rounded-full flex items-center gap-2
                     text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      {/* Location Info Card */}
      {isMapReady && (
        <div className="absolute bottom-28 right-4 z-[1000] max-w-xs">
          <div className="glassmorphism p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">Lokasi Saat Ini</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Menampilkan posisi real-time dengan akurasi GPS
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-1 h-1 rounded-full ${isLoading ? 'bg-yellow-500 pulse' : 'bg-green-500'}`}></div>
                  <span className={`text-xs font-medium ${isLoading ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isLoading ? 'Mencari...' : 'Aktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-[1001]">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Memuat peta...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapsTracker;