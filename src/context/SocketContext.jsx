// src/context/SocketContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
// ✅ 1. IMPORT useAuth UNTUK DAPAT TOKEN
import { useAuth } from './AuthContext';

// 1. Buat Context & Hook
const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

// 2. Buat Provider
export const SocketProvider = ({ children }) => {
  // State Sensor Utama
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

  // State Akurasi
  const [akurasi_jarak, setAkurasiJarak] = useState(null);
  const [akurasi_gyro, setAkurasiGyro] = useState(null);
  const [akurasi_aksel, setAkurasiAksel] = useState(null);

  // State Log Riwayat
  const [logs, setLogs] = useState([]);

  // Konfigurasi (Pastikan URL benar)
  const API_BASE_URL = "https://mollusklike-intactly-kennedi.ngrok-free.dev/api";
  const WS_URL = "wss://mollusklike-intactly-kennedi.ngrok-free.dev";

  // ✅ 2. AMBIL TOKEN DARI AuthContext
  const { token } = useAuth(); // Kita butuh token untuk fetch log

  // Logika WebSocket (Tidak Berubah)
  useEffect(() => {
    let ws;
    let reconnectTimeout;
    const connectWebSocket = () => {
      // ... (kode WebSocket tidak berubah) ...
      console.log(`🔌 [SocketContext] Mencoba koneksi ke ${WS_URL}...`);
      ws = new WebSocket(WS_URL);
      
      ws.onopen = () => {
          console.log("✅ [SocketContext] WebSocket Connected");
          setWsConnected(true);
          setReconnectAttempt(0);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📦 [SocketContext] Data diterima:", data); 
          
          if (data.jarak_cm !== undefined) setJarak(data.jarak_cm);
          if (data.aktivitas !== undefined) setAktivitas(data.aktivitas);
          if (data.persen_baterai !== undefined) setBattery(data.persen_baterai);
          if (data.akselerasi !== undefined) setAkselerasi(data.akselerasi);
          if (data.giroskop !== undefined) setGiroskop(data.giroskop);
          if (data.tegangan_baterai !== undefined) setTeganganBaterai(data.tegangan_baterai);
          if (data.kekuatan_sinyal !== undefined) setKekuatanSinyal(data.kekuatan_sinyal);

          if (data.akurasi_jarak !== undefined) setAkurasiJarak(data.akurasi_jarak);
          if (data.akurasi_gyro !== undefined) setAkurasiGyro(data.akurasi_gyro);
          if (data.akurasi_aksel !== undefined) setAkurasiAksel(data.akurasi_aksel);

          setLastUpdate(new Date());
        } catch (err) {
          console.error("❌ [SocketContext] Error parsing message:", err);
        }
      };

      ws.onerror = (error) => console.error("❌ [SocketContext] WebSocket Error:", error);
      
      ws.onclose = () => {
          console.log("❌ [SocketContext] WebSocket Disconnected");
          setWsConnected(false);
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
          console.log(`🔄 [SocketContext] Reconnecting in ${timeout/1000}s...`);
          reconnectTimeout = setTimeout(() => setReconnectAttempt(prev => prev + 1), timeout);
      };
    };
    
    connectWebSocket();
    
    return () => {
        clearTimeout(reconnectTimeout); 
        if (ws) { ws.onclose = null; ws.close(); }
    };
  }, [reconnectAttempt, WS_URL]);

  // Logika Fetch Log (Perbaikan URL dan Token)
  const fetchActivityLog = useCallback(async () => {
      // ✅ 3. JANGAN FETCH JIKA TOKEN BELUM ADA (misal saat app baru load)
      if (!token) {
          console.log("[SocketContext] Menunggu token sebelum fetch log...");
          return; 
      }

      console.log("[SocketContext] Mencoba fetch log dengan token...");
      try {
          // ✅ 4. PERBAIKI URL ENDPOINT menjadi /data/logs
          const response = await fetch(`${API_BASE_URL}/data/logs`, {
              method: 'GET', // (Optional, defaultnya GET)
              headers: {
                  // ✅ 5. TAMBAHKAN HEADER OTENTIKASI
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json' // (Biasanya tidak wajib untuk GET)
              }
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: `Gagal fetch logs (${response.status})` }));
              throw new Error(errorData.message || `Gagal fetch logs (${response.status})`);
          }

          const data = await response.json();
          console.log("📜 [SocketContext] Riwayat log di-fetch:", data);
          setLogs(data);
      } catch (error) {
          console.error("❌ [SocketContext] Error fetching logs:", error);
          // Mungkin set logs ke [] atau tampilkan error di UI?
          setLogs([]); 
      }
      // ✅ 6. TAMBAHKAN 'token' SEBAGAI DEPENDENSI useCallback
  }, [API_BASE_URL, token]);

  // Panggil fetchActivityLog saat komponen dimuat ATAU saat token berubah
  useEffect(() => {
    // Panggil fetch HANYA JIKA token sudah ada
    if(token) {
       fetchActivityLog();
    }
  // ✅ 7. TAMBAHKAN 'token' SEBAGAI DEPENDENSI useEffect
  }, [fetchActivityLog, token]);

  // 3. Sediakan semua state dan fungsi (Tidak Berubah)
  const value = {
    jarak,
    battery,
    aktivitas,
    akselerasi,
    giroskop,
    teganganBaterai,
    kekuatanSinyal,
    lastUpdate,
    wsConnected,
    akurasi_jarak,
    akurasi_gyro,
    akurasi_aksel,
    logs,
    fetchActivityLog,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};