// src/context/SocketContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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

  // =================================================================
  // ⚠️ KONFIGURASI NGROK (PENTING!)
  // =================================================================
  // Gunakan URL Ngrok kamu. 
  // Perhatikan: API pakai 'https', WebSocket pakai 'wss'
  const API_BASE_URL = "http://localhost:5000/api";
  const WS_URL = "ws://localhost:5000";

  // 3. AMBIL TOKEN DAN DATA USER (Untuk Filter ID)
  const { token, user } = useAuth(); 

  // Logika WebSocket
  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connectWebSocket = () => {
      // Cegah koneksi jika user belum login atau data user belum siap
      if (!token || !user || !user.id_perangkat) {
          console.log("⏳ [SocketContext] Menunggu login user...");
          return;
      }

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
          
          // ===========================================================
          // 🔒 FILTER KEAMANAN: Cek ID Perangkat
          // ===========================================================
          // Jika data yang masuk punya ID, tapi BEDA dengan ID user login:
          if (data.id_perangkat && user.id_perangkat) {
              if (data.id_perangkat !== user.id_perangkat) {
                  // ABAIKAN DATA INI (Jangan update state)
                  // console.log(`⛔ Data diblokir. Masuk: ${data.id_perangkat} != Saya: ${user.id_perangkat}`);
                  return; 
              }
          }

          // Jika lolos filter, baru update tampilan:
          console.log("📦 [SocketContext] Data valid:", data); 
          
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
  // Tambahkan 'user' dan 'token' ke dependency array
  }, [reconnectAttempt, WS_URL, user, token]);

  // Logika Fetch Log (Menggunakan NGROK URL)
  const fetchActivityLog = useCallback(async () => {
      if (!token) return;

      try {
          const response = await fetch(`${API_BASE_URL}/data/logs`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });

          if (!response.ok) throw new Error(`Gagal fetch logs (${response.status})`);

          const data = await response.json();
          setLogs(data);
      } catch (error) {
          console.error("❌ [SocketContext] Error fetching logs:", error);
          setLogs([]); 
      }
  }, [API_BASE_URL, token]);

  // Panggil fetchActivityLog saat token siap
  useEffect(() => {
    if(token) fetchActivityLog();
  }, [fetchActivityLog, token]);

  const value = {
    jarak, battery, aktivitas, akselerasi, giroskop, teganganBaterai, kekuatanSinyal,
    lastUpdate, wsConnected, akurasi_jarak, akurasi_gyro, akurasi_aksel, logs,
    fetchActivityLog,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};