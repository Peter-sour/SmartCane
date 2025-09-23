import React from 'react';
import { Battery, MapPin, Shield, Clock, Activity, AlertTriangle, Smartphone, Wifi, Settings } from 'lucide-react';
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";

export default function Dashboard() {

  const history = useHistory();

  const goToLog = () => {
    history.push("/log"); // pindah ke halaman /dashboard
  };
  // contoh data dummy
  const distance = 1.8;       // meter
  const battery = 75;         // %
  const statusText = "Aman";  // badge status

  const getBatteryColor = (percentage) => {
    if (percentage > 60) return 'from-emerald-400 via-green-400 to-emerald-500';
    if (percentage > 30) return 'from-amber-400 via-yellow-400 to-orange-400';
    return 'from-red-400 via-rose-400 to-red-500';
  };

  const getBatteryIcon = (percentage) => {
    if (percentage > 60) return '🔋';
    if (percentage > 30) return '⚡';
    return '🪫';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg sm:text-xl">🦯</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                  Smart Cane
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 truncate">Dashboard Monitoring</p>
              </div>
            </div>

            {/* Status & Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-xs sm:text-sm text-green-700 font-medium">Online</span>
              </div>
              <button className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* Hero Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">

          {/* Distance Sensor Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/60 transition-all duration-500 p-4 sm:p-6 border border-white/60 hover:border-blue-200/80 hover:bg-white/90">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Jarak Sensor</h2>
                  <p className="text-xs text-slate-500">Deteksi rintangan</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md">
                  {statusText}
                </span>
              </div>
            </div>

            <div className="flex items-end space-x-2 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-br from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent leading-none">
                {distance}
              </span>
              <span className="text-slate-500 text-base sm:text-lg font-semibold mb-1">meter</span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50/80 rounded-lg px-2 py-1.5">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span className="truncate">Update: 30/08/2025 22:50</span>
            </div>
          </div>

          {/* Battery Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-200/60 transition-all duration-500 p-4 sm:p-6 border border-white/60 hover:border-green-200/80 hover:bg-white/90">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  <Battery className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xs">{getBatteryIcon(battery)}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Daya Baterai</h2>
                <p className="text-xs text-slate-500">Status pengisian</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-800 to-green-600 bg-clip-text text-transparent">
                  {battery}%
                </span>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Estimasi</div>
                  <div className="text-sm font-semibold text-green-600">8.5 jam</div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-3 sm:h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${getBatteryColor(battery)} rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden`}
                    style={{ width: `${battery}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-slate-500">
                  <Smartphone className="w-3 h-3" />
                  <span>cane-001</span>
                </div>
                <span className="text-green-600 font-medium">Charging</span>
              </div>
            </div>
          </div>

          {/* Alert Status Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-amber-100/50 hover:shadow-xl hover:shadow-amber-200/60 transition-all duration-500 p-4 sm:p-6 border border-white/60 hover:border-amber-200/80 hover:bg-white/90 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Status Keamanan</h2>
                <p className="text-xs text-slate-500">Monitoring real-time</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3 p-2.5 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/60 shadow-sm">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-green-800 font-medium text-xs sm:text-sm min-w-0 flex-1">Jalur aman, tidak ada rintangan</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">✓</span>
              </div>

              <div className="flex items-center space-x-3 p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60 shadow-sm">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-blue-800 font-medium text-xs sm:text-sm min-w-0 flex-1">Sistem navigasi aktif</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">⚡</span>
              </div>
            </div>

            <button onClick={goToLog} className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-100 hover:to-indigo-100 text-slate-700 hover:text-blue-700 text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-300 border border-slate-200 hover:border-blue-200">
              Lihat Detail Lengkap →
            </button>
          </div>
        </div>

        {/* Main Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* GPS Tracking Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-purple-100/50 border border-white/60 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-800 text-sm sm:text-base lg:text-lg">Pelacakan GPS Live</h2>
                <p className="text-xs sm:text-sm text-slate-500">Lokasi real-time perangkat</p>
              </div>
              <div className="flex items-center space-x-1 bg-purple-100 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                <span className="text-xs text-purple-700 font-medium">Live</span>
              </div>
            </div>

            <div className="relative rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-300/60 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 h-48 sm:h-64 lg:h-72 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="relative mx-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-bounce" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs">📍</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-900 font-bold text-sm sm:text-base lg:text-lg">
                      📍 Lokasi Saat Ini
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-white/60">
                      <div className="text-slate-700 font-mono text-xs sm:text-sm">
                        -7.25764, 112.75246
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Surabaya, Jawa Timur
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 bg-white/80 rounded-full px-3 py-1.5 inline-block border border-white/60">
                      🗺️ Maps integration ready
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg shadow-indigo-100/50 border border-white/60 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-800 text-sm sm:text-base lg:text-lg">Log Aktivitas</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Riwayat sistem terbaru</p>
                </div>
              </div>
              <button className="w-8 h-8 bg-indigo-100 hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors group">
                <Activity className="w-4 h-4 text-indigo-600 group-hover:animate-spin" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-xl sm:rounded-2xl p-4 border border-slate-200/60 h-48 sm:h-64 lg:h-72 overflow-y-auto">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-slate-600 font-semibold text-sm sm:text-base">Belum ada aktivitas</div>
                    <div className="text-xs sm:text-sm text-slate-500 max-w-xs">
                      Log aktivitas dan notifikasi akan muncul di sini secara real-time
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-xs">
                    <button className="bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors font-medium">
                      📊 Export Log
                    </button>
                    <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      🔄 Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 p-3 sm:p-4 sticky bottom-4 z-40">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-slate-700 font-medium">Sistem Aktif</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
              <div className="flex items-center space-x-1 text-xs sm:text-sm text-slate-600">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Sync: Baru saja</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-slate-300"></div>
              <div className="hidden md:flex items-center space-x-1 text-xs text-slate-500">
                <span>Uptime: 24h 15m</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-xs text-slate-500">
                Smart Cane v2.1 • IoT Ready
              </div>
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">🤖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}