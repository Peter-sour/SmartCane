// PERBAIKAN: Impor 'useCallback' dan 'useRef'
import React, { useEffect, useState, useCallback, useRef } from "react";
// PERBAIKAN: Impor 'LogOut' dari lucide-react
import { Battery, MapPin, Activity, Clock, Menu, Bell, User, WifiOff, Wifi, LogOut } from 'lucide-react';
import { useHistory } from "react-router-dom";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

export default function Dashboard() {
  // ✅ State untuk semua data dari WebSocket/API
  const [jarak, setJarak] = useState(null);
  const [battery, setBattery] = useState(0);
  const [aktivitas, setAktivitas] = useState("Menunggu...");
  const [akselerasi, setAkselerasi] = useState({ x: 0, y: 0, z: 0 });
  const [giroskop, setGiroskop] = useState({ x: 0, y: 0, z: 0 });
  const [teganganBaterai, setTeganganBaterai] = useState(0);
  const [kekuatanSinyal, setKekuatanSinyal] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  
  // ===================================
  // ⬇️ FITUR BARU: State untuk Profil & Auth (Simulasi) ⬇️
  // ===================================
  // Di aplikasi nyata, 'isLoggedIn' dan 'username' akan datang dari Context
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Asumsi user sudah login
  const [username, setUsername] = useState("pengguna@smartcane.com"); // Contoh username
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State untuk buka/tutup dropdown
  
  const history = useHistory();
  
  // Ref untuk mendeteksi klik di luar dropdown
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  // ===================================
  // ⬆️ FITUR BARU SELESAI ⬆️
  // ===================================


  // ✅ Konfigurasi API & WebSocket
  const API_BASE_URL = "https://your-backend-api.com/api"; // 🔧 GANTI DENGAN URL API KAMU
  const WS_URL = "ws://localhost:5000"; // Untuk tes di laptop
  
  const goToLog = () => {
    history.push("/mobilelog");
  };

  // ✅ Fungsi untuk menentukan status berdasarkan jarak dan aktivitas
  const getStatus = () => {
    if (jarak === null || jarak === -1) return "Menunggu Data";
    if (jarak < 30) return "Bahaya!";
    if (aktivitas === "JATUH" || aktivitas === "DARURAT") return "Darurat!";
    if (jarak < 100) return "Hati-hati";
    return "Aman";
  };

  const getStatusColor = () => {
    const status = getStatus();
    if (status === "Bahaya!" || status === "Darurat!") return "bg-red-100 text-red-700";
    if (status === "Hati-hati") return "bg-yellow-100 text-yellow-700";
    if (status === "Aman") return "bg-emerald-100 text-emerald-700";
    return "bg-gray-100 text-gray-700";
  };

  const getBatteryColor = (percentage) => {
    if (percentage > 60) return 'bg-emerald-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // ✅ State untuk GPS Location
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });

  // ===================================
  // ⬇️ FITUR BARU: Logika Auth & Dropdown ⬇️
  // ===================================

  // Fungsi untuk Logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Set 'isLoggedIn' ke false
    setIsProfileOpen(false); // Tutup dropdown
    // Di aplikasi nyata, Anda akan membersihkan token, panggil context, dll.
  };

  // Efek untuk redirect ke /login jika sudah tidak login
  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login"); // Asumsi halaman login ada di '/login'
    }
  }, [isLoggedIn, history]);

  // Efek untuk menutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cek apakah klik BUKAN di dalam menu DAN BUKAN di tombol profil
      if (
        isProfileOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    
    // Tambahkan event listener
    document.addEventListener('mousedown', handleClickOutside);
    // Bersihkan saat unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]); // Hanya jalankan jika isProfileOpen berubah

  // ===================================
  // ⬆️ FITUR BARU SELESAI ⬆️
  // ===================================


  // ===================================
  // 🔌 WEBSOCKET CONNECTION (useEffect Terpisah)
  // ===================================
  useEffect(() => {
    // ... (Logika WebSocket Anda sudah benar, tidak perlu diubah) ...
    let ws;
    let reconnectTimeout;
    const connectWebSocket = () => {
      console.log(`🔌 Mencoba koneksi ke ${WS_URL}...`);
      ws = new WebSocket(WS_URL);
      ws.onopen = () => {
        console.log("✅ WebSocket Connected");
        setWsConnected(true);
        setReconnectAttempt(0);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📦 Data diterima dari WebSocket (Database):", data); 
          if (data.jarak_cm !== undefined) setJarak(data.jarak_cm);
          if (data.aktivitas !== undefined) setAktivitas(data.aktivitas);
          if (data.persen_baterai !== undefined) setBattery(data.persen_baterai);
          if (data.akselerasi !== undefined) setAkselerasi(data.akselerasi);
          if (data.giroskop !== undefined) setGiroskop(data.giroskop);
          if (data.tegangan_baterai !== undefined) setTeganganBaterai(data.tegangan_baterai);
          if (data.kekuatan_sinyal !== undefined) setKekuatanSinyal(data.kekuatan_sinyal);
          setLastUpdate(new Date());
        } catch (err) {
          console.error("❌ Error parsing WebSocket message:", err);
        }
      };
      ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
      ws.onclose = () => {
        console.log("❌ WebSocket Disconnected");
        setWsConnected(false);
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
        console.log(`🔄 Reconnecting in ${timeout/1000}s...`);
        reconnectTimeout = setTimeout(() => {
          setReconnectAttempt(prev => prev + 1);
        }, timeout);
      };
    };
    connectWebSocket();
    return () => {
      clearTimeout(reconnectTimeout); 
      if (ws) {
        ws.onclose = null; 
        ws.close();
      }
    };
  }, [reconnectAttempt, WS_URL]); 

  // ===================================
  // 📍 GPS LOCATION TRACKER (useEffect Terpisah)
  // ===================================
  useEffect(() => {
    // ... (Logika GPS Anda sudah benar, tidak perlu diubah) ...
    const updateLocation = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await Geolocation.requestPermissions();
          const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy });
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy });
            },
            (err) => console.error("Error (Web):", err),
            { enableHighAccuracy: true }
          );
        }
      } catch (err) {
        console.error("Error getting location:", err);
      }
    };
    updateLocation();
    const intervalId = setInterval(updateLocation, 1000); 
    return () => {
      clearInterval(intervalId);
    };
  }, []); 

  // ===================================
  // 🌐 REST API FUNCTIONS
  // ===================================
  const fetchLatestData = useCallback(async () => {
    // ... (Logika fetchLatestData Anda sudah benar, tidak perlu diubah) ...
    try {
      const response = await fetch(`${API_BASE_URL}/sensor/latest`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      console.log("📊 Data dari API:", data);
      if (data.jarak_cm !== undefined) setJarak(data.jarak_cm); 
      if (data.persen_baterai !== undefined) setBattery(data.persen_baterai);
      if (data.aktivitas !== undefined) setAktivitas(data.aktivitas);
      if (data.akselerasi !== undefined) setAkselerasi(data.akselerasi);
      if (data.giroskop !== undefined) setGiroskop(data.giroskop);
      if (data.tegangan_baterai !== undefined) setTeganganBaterai(data.tegangan_baterai);
      if (data.kekuatan_sinyal !== undefined) setKekuatanSinyal(data.kekuatan_sinyal);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  }, [API_BASE_URL]); 

  const fetchActivityLog = useCallback(async () => {
    // ... (Logika fetchActivityLog Anda sudah benar, tidak perlu diubah) ...
    try {
      const response = await fetch(`${API_BASE_URL}/sensor/logs?limit=10`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error('Failed to fetch logs');
      const logs = await response.json();
      console.log("📜 Activity Logs:", logs);
      return logs;
    } catch (error) {
      console.error("❌ Error fetching logs:", error);
      return [];
    }
  }, [API_BASE_URL]); 

  const sendLocationToBackend = useCallback(async (lat, lon) => {
    // ... (Logika sendLocationToBackend Anda sudah benar, tidak perlu diubah) ...
    try {
      const response = await fetch(`${API_BASE_URL}/location/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_perangkat: 'tongkat-001',
          latitude: lat,
          longitude: lon,
          accuracy: location.accuracy, 
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error('Failed to send location');
      console.log("✅ Location sent to backend");
    } catch (error) {
      console.error("❌ Error sending location:", error);
    }
  }, [API_BASE_URL, location.accuracy]); 

  // ===================================
  // 📱 AUTO SEND LOCATION (useEffect)
  // ===================================
  useEffect(() => {
    if (location.latitude && location.longitude) {
      sendLocationToBackend(location.latitude, location.longitude);
      const locationInterval = setInterval(() => {
        sendLocationToBackend(location.latitude, location.longitude);
      }, 10000); 
      return () => clearInterval(locationInterval);
    }
  }, [location.latitude, location.longitude, sendLocationToBackend]);

  // ===================================
  // ⬇️ RENDER JSX (DENGAN HEADER BARU) ⬇️
  // ===================================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartCane</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>

            {/* Right Actions */}
            {/* PERBAIKAN: Tambahkan 'relative' di sini agar dropdown pas */}
            <div className="flex items-center space-x-2 relative">
              {/* WebSocket Status Indicator */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${wsConnected ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {wsConnected ? (
                  <Wifi className="w-5 h-5 text-emerald-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600" />
                )}
              </div>
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* PERBAIKAN: Tombol User (Profil) */}
              <button 
                ref={profileButtonRef} // Tambahkan ref
                onClick={() => setIsProfileOpen(prev => !prev)} // Toggle dropdown
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>

              {/* PERBAIKAN: Dropdown Menu Profil */}
              {isProfileOpen && (
                <div 
                  ref={profileMenuRef} // Tambahkan ref
                  className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-500">Login sebagai</p>
                    <p className="text-sm font-semibold text-gray-900 truncate" title={username}>
                      {username}
                    </p>
                  </div>
                  <hr className="border-gray-100" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-4">

        {/* ... (Sisa JSX Anda sudah benar, tidak perlu diubah) ... */}

        {/* Connection Status Alert */}
        {!wsConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-semibold text-yellow-900">Koneksi Terputus</p>
                <p className="text-xs text-yellow-700">Mencoba koneksi ulang...</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Status Perangkat</h2>
              <p className="text-sm text-gray-500">Update real-time</p>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor()}`}>
              {getStatus()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Distance */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900">Jarak</span>
              </div>
              <div className="flex items-end space-x-1">
                <span className="text-3xl font-black text-blue-900">
                  {jarak !== null && jarak !== -1 ? jarak : "-"}
                </span>
                <span className="text-sm text-blue-700 mb-1">cm</span>
              </div>
              {jarak === -1 && (
                <p className="text-xs text-blue-600 mt-1">Tidak terdeteksi</p>
              )}
              {jarak === null && (
                <p className="text-xs text-blue-600 mt-1">Menunggu data...</p>
              )}
            </div>

            {/* Battery */}
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Battery className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-900">Baterai</span>
              </div>
              <div className="flex items-end space-x-1">
                <span className="text-3xl font-black text-emerald-900">{battery}</span>
                <span className="text-sm text-emerald-700 mb-1">%</span>
              </div>
              <div className="mt-2 h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBatteryColor(battery)} transition-all duration-500`}
                  style={{ width: `${battery}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* GPS Tracking */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Lokasi Real-Time</h2>
                <p className="text-xs text-gray-500">GPS Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-purple-100 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-700 font-semibold">Live</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 text-center">
            {location.latitude && location.longitude ? (
              <div className="space-y-3">
                <div className="text-sm font-bold text-gray-900">📍 Koordinat</div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-sm font-mono text-gray-900">
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Akurasi: ±{Math.round(location.accuracy)} m
                  </div>
                </div>
                <button
                  onClick={() => history.push("/map")}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm active:scale-98 transition"
                >
                  Buka Maps Tracker
                </button>
              </div>
            ) : (
              <div className="py-8">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-400 animate-bounce" />
                </div>
                <p className="text-sm text-gray-600">Mengambil lokasi...</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity & Sensor Data */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Aktivitas & Sensor</h2>
                <p className="text-xs text-gray-500">Data real-time</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Aktivitas */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-900">Aktivitas</span>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  {aktivitas}
                </span>
              </div>
            </div>

            {/* Akselerasi */}
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-purple-900 mb-2">Akselerasi</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-gray-500">X</div>
                  <div className="font-bold text-purple-900">{akselerasi.x.toFixed(2)}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-gray-500">Y</div>
                  <div className="font-bold text-purple-900">{akselerasi.y.toFixed(2)}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-gray-500">Z</div>
                  <div className="font-bold text-purple-900">{akselerasi.z.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Giroskop */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-sm font-semibold text-orange-900 mb-2">Giroskop</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-gray-500">X</div>
                  <div className="font-bold text-orange-900">{giroskop.x.toFixed(3)}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-gray-500">Y</div>
                  <div className="font-bold text-orange-900">{giroskop.y.toFixed(3)}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-gray-500">Z</div>
                  <div className="font-bold text-orange-900">{giroskop.z.toFixed(3)}</div>
                </div>
              </div>
            </div>

            {/* Info Tambahan */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Tegangan Baterai</div>
                <div className="text-sm font-bold text-gray-900">{teganganBaterai.toFixed(2)}V</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">Sinyal</div>
                <div className="text-sm font-bold text-gray-900">{kekuatanSinyal}</div>
              </div>
            </div>

            {lastUpdate && (
              <div className="text-xs text-center text-gray-500 pt-2">
                Update terakhir: {lastUpdate.toLocaleTimeString('id-ID')}
              </div>
            )}

            <button 
              onClick={goToLog}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm active:scale-98 transition"
            >
              Lihat Log Detail
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={fetchLatestData} 
            className="bg-white border border-gray-200 rounded-xl p-4 text-center active:scale-95 transition"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="text-sm font-bold text-gray-900">Refresh Data</div>
          </button>

          <button className="bg-white border border-gray-200 rounded-xl p-4 text-center active:scale-95 transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="text-sm font-bold text-gray-900">Pengaturan</div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>{wsConnected ? 'WebSocket Aktif' : 'WebSocket Terputus'}</span>
            </div>
            <span className="text-gray-500">SmartCane v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}