import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Activity, Zap, Eye, Volume2, Vibrate, Settings, RefreshCw, Download, Filter } from 'lucide-react';
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";


export default function DetailSecurityPage() {

  const history = useHistory();

  const goToDashboard = () => {
    history.push("/Dasboard"); // pindah ke halaman /dashboard
  };
  const [activeTab, setActiveTab] = useState('realtime');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample security data
  const securityData = {
    currentStatus: 'safe',
    lastUpdate: '2025-09-23T22:50:07',
    obstacleDistance: 1.8,
    alerts: [
      {
        id: 1,
        time: '22:45:23',
        type: 'warning',
        title: 'Rintangan Terdeteksi',
        description: 'Objek dengan jarak 0.5m terdeteksi di depan',
        location: 'Jl. Raya Gubeng No. 123',
        action: 'Getaran dan suara peringatan aktif',
        resolved: true
      },
      {
        id: 2,
        time: '22:30:15',
        type: 'info',
        title: 'Kalibrasi Sensor',
        description: 'Sistem melakukan kalibrasi otomatis',
        location: '-',
        action: 'Proses selesai dalam 3 detik',
        resolved: true
      },
      {
        id: 3,
        time: '22:15:08',
        type: 'success',
        title: 'Area Aman',
        description: 'Jalur bebas rintangan dalam radius 5m',
        location: 'Jl. Diponegoro No. 45',
        action: 'Mode navigasi normal',
        resolved: true
      },
      // {
      //   id: 4,
      //   time: '21:58:42',
      //   type: 'warning',
      //   title: 'Cuaca Berubah',
      //   description: 'Sensor mendeteksi hujan ringan',
      //   location: 'Area sekitar pengguna',
      //   action: 'Mode grip anti-slip diaktifkan',
      //   resolved: true
      // },
      {
        id: 5,
        time: '21:45:30',
        type: 'error',
        title: 'Koneksi Terputus',
        description: 'Kehilangan sinyal GPS selama 12 detik',
        location: 'Koordinat terakhir: -7.25764, 112.75246',
        action: 'Reconnect otomatis berhasil',
        resolved: true
      }
    ],
    sensors: {
      ultrasonic: { status: 'active', accuracy: 98, lastCheck: '22:50:07' },
      gyroscope: { status: 'active', accuracy: 95, lastCheck: '22:50:05' },
      accelerometer: { status: 'active', accuracy: 97, lastCheck: '22:50:06' },
      gps: { status: 'active', accuracy: 94, lastCheck: '22:50:07' },
      bluetooth: { status: 'active', accuracy: 99, lastCheck: '22:50:04' }
    },
    settings: {
      vibrationLevel: 75,
      soundLevel: 60,
      sensitivityLevel: 80,
      autoMode: true,
      nightMode: false,
      emergencyContact: true
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return 'from-emerald-500 to-green-500';
      case 'warning': return 'from-amber-500 to-orange-500';
      case 'error': return 'from-red-500 to-rose-500';
      case 'info': return 'from-blue-500 to-indigo-500';
      default: return 'from-slate-500 to-gray-500';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-white" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-white" />;
      case 'error': return <XCircle className="w-5 h-5 text-white" />;
      case 'info': return <Activity className="w-5 h-5 text-white" />;
      default: return <Shield className="w-5 h-5 text-white" />;
    }
  };

  const filteredAlerts = securityData.alerts.filter(alert =>
    filterStatus === 'all' || alert.type === filterStatus
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={goToDashboard} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Detail Keamanan
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">Monitoring & Log Sistem Lengkap</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </button>
              <button className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                <Download className="w-5 h-5 text-green-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Status Saat Ini</h3>
                <p className="text-sm text-slate-500">Real-time monitoring</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">AMAN</div>
            <p className="text-xs text-slate-500 mt-1">Terakhir update: 22:50:07</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Jarak Deteksi</h3>
                <p className="text-sm text-slate-500">Sensor ultrasonik</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">1.8m</div>
            <p className="text-xs text-slate-500 mt-1">Tidak ada rintangan</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Total Alert</h3>
                <p className="text-sm text-slate-500">24 jam terakhir</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600">{securityData.alerts.length}</div>
            <p className="text-xs text-slate-500 mt-1">Semua teratasi</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-1">
          <div className="flex space-x-1">
            {[
              { id: 'realtime', label: 'Real-time', icon: Activity },
              { id: 'history', label: 'Riwayat Alert', icon: Clock },
              { id: 'sensors', label: 'Status Sensor', icon: Zap }
              // { id: 'settings', label: 'Pengaturan', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">

          {/* Real-time Tab */}
          {activeTab === 'realtime' && (
            <div className="gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/60">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span>Monitor Live</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </h3>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">Deteksi Rintangan</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">AKTIF</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">1.8 meter</div>
                    <p className="text-sm text-green-600">Jalur aman untuk navigasi</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800">GPS Tracking</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">ONLINE</span>
                    </div>
                    <div className="text-sm font-mono text-blue-700">-7.25764, 112.75246</div>
                    <p className="text-sm text-blue-600">Akurasi: 3.2 meter</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-800">Mode Navigasi</span>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">AUTO</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-purple-700">
                      <div className="flex items-center space-x-1">
                        <Volume2 className="w-4 h-4" />
                        <span>Suara: 60%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Vibrate className="w-4 h-4" />
                        <span>Getaran: 75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  <span>Riwayat Alert & Peringatan</span>
                </h3>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Semua Status</option>
                    <option value="success">Sukses</option>
                    <option value="warning">Peringatan</option>
                    <option value="error">Error</option>
                    <option value="info">Info</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 hover:bg-white/60 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor(alert.type)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        {getStatusIcon(alert.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{alert.title}</h4>
                          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                            <span className="text-xs text-slate-500">{alert.time}</span>
                            {alert.resolved && (
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-2">{alert.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{alert.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                            <span className="truncate">{alert.action}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sensors Tab */}
          {activeTab === 'sensors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(securityData.sensors).map(([sensor, data]) => (
                <div key={sensor} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/60">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-800 capitalize">{sensor.replace('_', ' ')}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      data.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {data.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Akurasi</span>
                        <span className="text-sm font-semibold text-slate-800">{data.accuracy}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            data.accuracy >= 95 ? 'bg-green-500' :
                            data.accuracy >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${data.accuracy}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Last Check:</span>
                      <span>{data.lastCheck}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
