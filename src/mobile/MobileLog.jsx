import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Activity, Volume2, Vibrate, RefreshCw, Download, ChevronDown } from 'lucide-react';
import { useHistory } from "react-router-dom";

export default function DetailSecurityPage() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('realtime');
  const [filterStatus, setFilterStatus] = useState('all');

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
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'info': return <Activity className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const filteredAlerts = securityData.alerts.filter(alert =>
    filterStatus === 'all' || alert.type === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => history.push("/mobiledashboard")}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Detail Keamanan</h1>
                <p className="text-xs text-gray-500">Monitoring & Log Sistem</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">

        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-emerald-600">AMAN</div>
            <p className="text-xs text-gray-500 mt-1">Status</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600">1.8m</div>
            <p className="text-xs text-gray-500 mt-1">Jarak</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600">{securityData.alerts.length}</div>
            <p className="text-xs text-gray-500 mt-1">Alert</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl p-1 border border-gray-200">
          <div className="flex space-x-1">
            {[
              { id: 'realtime', label: 'Live', icon: Activity },
              { id: 'history', label: 'Riwayat', icon: Clock },
              { id: 'sensors', label: 'Sensor', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-white'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">

          {/* Real-time Tab */}
          {activeTab === 'realtime' && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Monitor Live</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-600 font-semibold">AKTIF</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-emerald-900">Deteksi Rintangan</span>
                      <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-semibold">AKTIF</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-700">1.8 meter</div>
                    <p className="text-sm text-emerald-600 mt-1">Jalur aman untuk navigasi</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-900">GPS Tracking</span>
                      <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full font-semibold">ONLINE</span>
                    </div>
                    <div className="text-sm font-mono text-blue-700">-7.25764, 112.75246</div>
                    <p className="text-sm text-blue-600 mt-1">Akurasi: 3.2 meter</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-purple-900">Mode Navigasi</span>
                      <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full font-semibold">AUTO</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-purple-700 mt-2">
                      <div className="flex items-center space-x-1">
                        <Volume2 className="w-4 h-4" />
                        <span>60%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Vibrate className="w-4 h-4" />
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Riwayat Alert</h3>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700"
                >
                  <option value="all">Semua</option>
                  <option value="success">Sukses</option>
                  <option value="warning">Peringatan</option>
                  <option value="error">Error</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className={`rounded-xl p-4 border ${getStatusColor(alert.type)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(alert.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-sm">{alert.title}</h4>
                          <span className="text-xs opacity-70 ml-2">{alert.time}</span>
                        </div>

                        <p className="text-sm opacity-90 mb-2">{alert.description}</p>

                        <div className="space-y-1 text-xs opacity-75">
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
            <div className="space-y-3">
              {Object.entries(securityData.sensors).map(([sensor, data]) => (
                <div key={sensor} className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900 capitalize">{sensor.replace('_', ' ')}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      data.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {data.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Akurasi</span>
                      <span className="text-sm font-bold text-gray-900">{data.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          data.accuracy >= 95 ? 'bg-emerald-500' :
                          data.accuracy >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${data.accuracy}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
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