import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowLeft, Calendar, Activity, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileTimeline() {
  const history = useHistory();
  const { token } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Ganti URL sesuai Ngrok kamu
  const API_BASE_URL = "http://localhost:5000/api"; 

  // 1. Fetch Data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/data/history`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Backend mengirim descending (terbaru dulu). 
          // Kita butuh ascending (terlama -> terbaru) untuk menggambar alur.
          setHistoryData(data.reverse());
        }
      } catch (error) {
        console.error("Gagal ambil history:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchHistory();
  }, [token]);

  // 2. Render Peta & Jalur
  useEffect(() => {
    const loadLeaflet = () => {
      if (!window.L) {
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
          document.head.appendChild(link);
        }
        if (!document.querySelector('script[src*="leaflet"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
          script.onload = initMap;
          document.head.appendChild(script);
        }
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapContainerRef.current || !window.L) return;

      // Cleanup peta lama
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Buat Peta
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([-6.2088, 106.8456], 13);

      mapInstanceRef.current = map;

      // Gunakan Peta CartoDB Voyager (Lebih bersih & modern daripada OpenStreetMap biasa)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '© CartoDB'
      }).addTo(map);

      // --- GAMBAR JALUR & TITIK ---
      if (historyData.length > 0) {
        const latLngs = historyData.map(item => [item.latitude, item.longitude]);

        // A. GAMBAR GARIS (JALUR)
        // Layer 1: Garis Bayangan (Biar garis utama menonjol)
        window.L.polyline(latLngs, {
          color: '#4f46e5', // Ungu Gelap
          weight: 8,        // Tebal
          opacity: 0.2,     // Transparan (efek glow)
          lineCap: 'round'
        }).addTo(map);

        // Layer 2: Garis Utama
        const mainLine = window.L.polyline(latLngs, {
          color: '#6366f1', // Ungu Cerah (Indigo)
          weight: 4,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Auto Zoom ke seluruh jalur
        map.fitBounds(mainLine.getBounds(), { padding: [50, 80] });

        // B. GAMBAR TITIK-TITIK PENGHUBUNG (Dot di setiap data)
        // Biar user lihat "Ooh, ini titik-titik datanya"
        historyData.forEach((point) => {
             window.L.circleMarker([point.latitude, point.longitude], {
                radius: 4,         // Ukuran titik
                fillColor: "#fff", // Warna tengah putih
                color: "#6366f1",  // Pinggiran ungu
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            }).addTo(map).bindPopup(`
                <div style="text-align:center;">
                   <p style="margin:0; font-weight:bold; font-size:10px; color:#888;">WAKTU</p>
                   <p style="margin:0; font-weight:bold;">${new Date(point.timestamp || point.createdAt).toLocaleTimeString('id-ID')}</p>
                </div>
            `);
        });

        // C. MARKER START & END (Spesial)
        const startPoint = historyData[0];
        const endPoint = historyData[historyData.length - 1];

        // Ikon Awal (Hijau)
        const startIcon = window.L.divIcon({
          className: '',
          html: `<div style="background:#10b981; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7] // Tengah
        });

        // Ikon Akhir (Merah + Animasi Pulse CSS)
        const endIcon = window.L.divIcon({
          className: 'pulse-icon', // Kita buat class CSS di bawah
          html: `<div style="background:#ef4444; width:18px; height:18px; border-radius:50%; border:3px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9] // Tengah
        });

        window.L.marker([startPoint.latitude, startPoint.longitude], { icon: startIcon }).addTo(map).bindPopup("<b>Mulai</b>");
        window.L.marker([endPoint.latitude, endPoint.longitude], { icon: endIcon, zIndexOffset: 1000 }).addTo(map).bindPopup("<b>Lokasi Terakhir</b>").openPopup();
      }
    };

    if (!loading) {
        setTimeout(loadLeaflet, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, historyData]);

  return (
    <div className="relative h-screen w-screen bg-gray-100 overflow-hidden">
      
      {/* CSS untuk Animasi Pulse di Marker Terakhir */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-ring {
            0% { transform: scale(0.33); opacity: 1; }
            80%, 100% { transform: scale(2.5); opacity: 0; }
          }
          .pulse-icon::before {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            width: 18px; height: 18px;
            margin-left: -9px; margin-top: -9px;
            border-radius: 50%;
            background-color: rgba(239, 68, 68, 0.6);
            animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            z-index: -1;
          }
          .glass-panel {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
        `
      }} />

      {/* Peta */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Tombol Kembali (Floating) */}
      <button 
        onClick={() => history.goBack()}
        className="absolute top-5 left-5 z-[1000] w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Info Panel Bawah */}
      <div className="absolute bottom-8 left-4 right-4 z-[1000]">
        <div className="glass-panel rounded-2xl p-4 border-t-4 border-t-indigo-500">
           {loading ? (
               <div className="flex items-center justify-center space-x-2 py-2">
                   <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-sm text-gray-500">Memuat jalur...</span>
               </div>
           ) : historyData.length > 0 ? (
               <div>
                   <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Rute Perjalanan</h2>
                            <p className="text-xs text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1"/> 
                                {new Date().toLocaleDateString('id-ID', {weekday: 'long', day:'numeric', month:'long'})}
                            </p>
                        </div>
                        <div className="bg-indigo-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-bold text-indigo-700">{historyData.length} Titik</span>
                        </div>
                   </div>

                   {/* Mini Statistik Waktu */}
                   <div className="flex justify-between items-center text-sm bg-white/50 p-2 rounded-lg border border-gray-100">
                       <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-gray-400 uppercase">Mulai</span>
                           <span className="font-bold text-emerald-600">
                               {new Date(historyData[0].timestamp || historyData[0].createdAt).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                           </span>
                       </div>
                       <div className="flex-1 mx-4 border-b-2 border-dashed border-gray-300 relative top-1">
                            <Navigation className="w-4 h-4 text-gray-300 absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-white px-0.5" />
                       </div>
                       <div className="flex flex-col text-right">
                           <span className="text-[10px] font-bold text-gray-400 uppercase">Sampai</span>
                           <span className="font-bold text-red-600">
                               {new Date(historyData[historyData.length-1].timestamp || historyData[historyData.length-1].createdAt).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                           </span>
                       </div>
                   </div>
               </div>
           ) : (
               <div className="text-center py-4">
                   <p className="text-sm font-semibold text-gray-600">Belum ada data pergerakan.</p>
                   <p className="text-xs text-gray-400 mt-1">Alat perlu berpindah > 20m untuk merekam jalur.</p>
               </div>
           )}
        </div>
      </div>

    </div>
  );
}