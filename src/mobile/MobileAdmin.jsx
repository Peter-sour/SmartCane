import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Activity, Smartphone, AlertTriangle,
  MapPin, Battery, Bell,
  Menu, Settings, LogOut,
  ChevronRight, Circle, TrendingUp // Tambahkan icon untuk grafik
} from 'lucide-react';

// --- Mengasumsikan kita hanya melihat perangkat "SC-001" ---
const FOCUSED_DEVICE_ID = 'SC-001';

export default function DeviceDashboard() {
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);

  // Data dummy baru untuk satu perangkat
  const device = {
    id: 'SC-001',
    userName: 'Ahmad Rizki',
    status: 'Aktif',
    lastSeen: '5 menit lalu',
    battery: 85,
    connection: 'Baik'
  };

  // Data alert yang sudah difilter HANYA untuk device 'SC-001'
  const deviceAlerts = [
    { id: 1, type: 'warning', message: 'Baterai rendah (15%)', time: '10 menit lalu' },
    { id: 2, type: 'info', message: 'Kalibrasi sensor selesai', time: '1 jam lalu' },
    { id: 3, type: 'info', message: 'Perangkat terhubung', time: '2 jam lalu' },
    { id: 4, type: 'error', message: 'Koneksi terputus', time: '3 jam lalu' },
  ];

  // Fungsi untuk badge Tipe di tabel
  const getTypeBadge = (type) => {
    switch(type) {
      case 'warning': return 'bg-amber-100 text-amber-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header (Tetap sama) */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{device.userName}</h1>
                <p className="text-xs text-gray-500">Detail Perangkat: {device.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        {showMenu && (
          <div className="absolute top-full right-4 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Pengaturan</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">

        {/* Status Spesifik Perangkat (Tetap sama) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-600" />
              </div>
              <div className={`w-2 h-2 rounded-full ${device.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
            </div>
            <div className="text-2xl font-black text-gray-900">{device.status}</div>
            <p className="text-sm text-gray-600 mt-1">Status Perangkat</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Battery className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{device.battery}%</div>
            <p className="text-sm text-gray-600 mt-1">Level Baterai</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{device.connection}</div>
            <p className="text-sm text-gray-600 mt-1">Koneksi Sinyal</p>
          </div>
        </div>
        
        {/* --- INI GRAFIKNYA --- */}
        {/* Placeholder Grafik */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="text-base font-bold text-gray-900 mb-4">Grafik Baterai (24 Jam)</h2>
          
          {/* Ini adalah placeholder. Ganti div ini dengan komponen chart Anda */}
          <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto" />
              <p className="mt-2 text-sm font-semibold">Komponen Grafik (misal: Chart.js) akan tampil di sini</p>
            </div>
          </div>
          {/* Akhir dari placeholder */}

        </div>
        
        {/* --- INI LOG-NYA --- */}
        {/* Log Aktivitas Perangkat (Format Tabel) */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Log Aktivitas Perangkat</h2>
            <button className="text-sm text-emerald-600 font-bold flex items-center space-x-1">
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Pesan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deviceAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.time}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getTypeBadge(alert.type)}`}>
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {alert.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (Tetap sama) */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => history.push(`/device/${device.id}/location`)}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center active:scale-95 transition"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-bold text-gray-900">Lacak Lokasi</div>
          </button>
          <button
            className="bg-white border border-gray-200 rounded-xl p-4 text-center active:scale-95 transition"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-sm font-bold text-gray-900">Bunyikan Alarm</div>
          </button>
          <button
            onClick={() => history.push(`/device/${device.id}/settings`)}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center active:scale-95 transition"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-sm font-bold text-gray-900">Pengaturan</div>
          </button>
        </div>

      </div>
    </div>
  );
}