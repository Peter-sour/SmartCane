import React, { useState } from 'react';
// Tambahkan ikon Wifi untuk Sinyal
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Activity, Volume2, Vibrate, RefreshCw, Download, Filter, Zap, Battery, BarChartHorizontal, Wifi } from 'lucide-react';
import { useHistory } from "react-router-dom";
// ✅ IMPORT SOCKET CONTEXT HOOK
import { useSocket } from "../context/SocketContext";

export default function DetailSecurityPage() {
    const history = useHistory();
    const [activeTab, setActiveTab] = useState('realtime');
    const [filterStatus, setFilterStatus] = useState('all');

    // ✅ AMBIL DATA DINAMIS DARI SOCKET CONTEXT
    const {
        jarak,
        aktivitas,
        giroskop,
        akselerasi,
        logs,
        fetchActivityLog,
        lastUpdate,
        battery,
        teganganBaterai,
        kekuatan_sinyal, // ✅ AMBIL KEKUATAN SINYAL
        // ⚠️ Asumsi placeholder akurasi
        akurasi_gyro,
        akurasi_aksel,
        akurasi_jarak,
        akurasi_sinyal // Asumsi placeholder
    } = useSocket();

    // Fungsi utilitas (biarkan)
    const getStatusColor = (type) => { /* ... (tidak berubah) ... */
      switch (type) {
          case 'JATUH': return 'bg-red-100 text-red-700 border-red-200';
          case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200'; // Untuk rintangan mungkin?
          case 'error': return 'bg-red-100 text-red-700 border-red-200';
          case 'info': return 'bg-blue-100 text-blue-700 border-blue-200'; // Default
          default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    const getStatusIcon = (type) => { /* ... (tidak berubah) ... */
      switch (type) {
          case 'JATUH': return <XCircle className="w-5 h-5" />;
          case 'warning': return <AlertTriangle className="w-5 h-5" />;
          case 'error': return <XCircle className="w-5 h-5" />;
          case 'info': return <Activity className="w-5 h-5" />; // Default
          default: return <Activity className="w-5 h-5" />;
      }
    };

    // ✅ FORMAT DATA LOG (Sudah Benar)
    const formattedAlerts = logs.map((log, index) => { /* ... (tidak berubah) ... */
      let type = 'info'; // Default
      if (log.aktivitas === 'JATUH' || log.aktivitas === 'DARURAT') {
        type = 'error';
      } else if (log.jarak_cm !== null && log.jarak_cm < 100 && log.jarak_cm !== -1) {
        type = 'warning'; // Anggap jarak dekat sebagai warning
      }
      
      return {
        id: log._id || index,
        time: new Date(log.createdAt || log.timestamp || Date.now()).toLocaleTimeString('id-ID'),
        type: type,
        title: log.aktivitas || 'Log Sensor',
        description: `Jarak: ${log.jarak_cm === -1 ? 'N/A' : log.jarak_cm + 'cm'}. Baterai: ${log.persen_baterai || 'N/A'}%`,
        location: `(Data Lokasi Belum Ada)`, // Ganti jika ada data GPS di log
        action: `Aksel: ${log.magnitudo_aksel?.toFixed(1)}, Gyro: ${log.magnitudo_gyro?.toFixed(1)}`,
        resolved: true // Asumsi semua log adalah kejadian masa lalu
      };
    });

    console.log("Formatted Alerts:", formattedAlerts);

    const filteredAlerts = formattedAlerts.filter(alert =>
        filterStatus === 'all' || alert.type === filterStatus
    );

    console.log("Filter Status:", filterStatus); // <-- TAMBAHKAN INI
    console.log("Filtered Alerts:", filteredAlerts); // <-- TAMBAHKAN INI

    // Fungsi untuk menampilkan status sensor
    const getSensorStatus = (sensorData, checkValueOnly = false) => {
        if (sensorData === undefined || sensorData === null) return { text: 'N/A', color: 'bg-gray-100 text-gray-700' };

        let isActive = false;
        if (checkValueOnly && typeof sensorData === 'number') {
            isActive = sensorData !== 0; // Cek angka saja
        } else if (typeof sensorData === 'object' && sensorData !== null) {
            isActive = Object.values(sensorData).some(val => typeof val === 'number' && val !== 0); // Cek object
        } else if (typeof sensorData === 'number') {
             isActive = sensorData !== 0; // Cek angka default
        }

        return isActive
            ? { text: 'ACTIVE', color: 'bg-emerald-100 text-emerald-700' }
            : { text: 'IDLE', color: 'bg-gray-100 text-gray-700' };
    };

    // Fungsi untuk mendapatkan warna progress bar akurasi
    const getAccuracyColor = (accuracy) => { /* ... (tidak berubah) ... */
      if (accuracy === undefined || accuracy === null) return 'bg-gray-300'; // Warna default jika data tidak ada
      if (accuracy >= 95) return 'bg-emerald-500';
      if (accuracy >= 85) return 'bg-yellow-500';
      return 'bg-red-500';
    };


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
                {/* ... Header JSX (Tidak Berubah) ... */}
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
                      <button
                        onClick={fetchActivityLog}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition"
                      >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
            </div>

            <div className="px-4 py-6 space-y-4">

                {/* Status Overview */}
                <div className="grid grid-cols-3 gap-3">
                     {/* ... Status Overview JSX (Tidak Berubah) ... */}
                      <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <div className={`w-10 h-10 ${aktivitas === 'JATUH' || aktivitas === 'DARURAT' ? 'bg-red-100' : 'bg-emerald-100'} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                          <Shield className={`w-5 h-5 ${aktivitas === 'JATUH' || aktivitas === 'DARURAT' ? 'text-red-600' : 'text-emerald-600'}`} />
                        </div>
                        <div className={`text-lg font-bold ${aktivitas === 'JATUH' || aktivitas === 'DARURAT' ? 'text-red-600' : 'text-emerald-600'}`}>{aktivitas}</div>
                        <p className="text-xs text-gray-500 mt-1">Status</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-blue-600">{jarak !== null ? (jarak === -1 ? '-' : `${jarak}cm`) : '-'}</div>
                        <p className="text-xs text-gray-500 mt-1">Jarak</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-lg font-bold text-purple-600">{logs.length}</div>
                        <p className="text-xs text-gray-500 mt-1">Log</p>
                      </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl p-1 border border-gray-200">
                     {/* ... Tab Navigation JSX (Tidak Berubah) ... */}
                      <div className="flex space-x-1">
                        {[
                          { id: 'realtime', label: 'Live', icon: Activity },
                          { id: 'history', label: 'Riwayat', icon: Clock },
                          { id: 'sensors', label: 'Sensor', icon: Zap }
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 rounded-lg transition ${
                                activeTab === tab.id
                                  ? 'bg-emerald-500 text-white shadow-md'
                                  : 'text-gray-600 hover:bg-gray-100'
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
                             {/* ... Real-time Tab JSX (Tidak Berubah) ... */}
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
                                    {/* ... */}
                                    <div className="text-2xl font-black text-emerald-700">{jarak !== null ? (jarak === -1 ? 'N/A' : `${jarak} cm`) : '-'}</div>
                                    <p className="text-sm text-emerald-600 mt-1">{jarak > 100 ? 'Jalur aman' : 'Rintangan terdeteksi!'}</p>
                                  </div>
                                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    {/* ... */}
                                    <div className="text-xl font-bold text-blue-700">{aktivitas}</div>
                                    <p className="text-sm text-blue-600 mt-1">Status saat ini</p>
                                  </div>
                                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                     {/* ... */}
                                      <div className="flex items-center space-x-4 text-sm text-purple-700 mt-2">
                                        <div className="flex items-center space-x-1">
                                          <Battery className="w-4 h-4" />
                                          <span>Persen: {battery}%</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Zap className="w-4 h-4" />
                                          <span>Tegangan: {teganganBaterai.toFixed(2)}V</span>
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
                             {/* ... History Tab JSX (Tidak Berubah) ... */}
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900">Riwayat Alert</h3>
                                <select
                                  value={filterStatus}
                                  onChange={(e) => setFilterStatus(e.target.value)}
                                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700"
                                >
                                  <option value="all">Semua</option>
                                  <option value="error">Jatuh/Darurat</option>
                                  <option value="warning">Rintangan</option>
                                  <option value="info">Info</option>
                                </select>
                              </div>
                              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
                                  <div key={alert.id} className={`rounded-xl p-4 border ${getStatusColor(alert.type)}`}>
                                    <div className="flex items-start space-x-3">
                                      <div className="flex-shrink-0 mt-1">
                                        {getStatusIcon(alert.type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                          <h4 className="font-bold text-sm">{alert.title}</h4>
                                          <span className="text-xs opacity-70 ml-2 whitespace-nowrap">{alert.time}</span>
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
                                )) : (
                                  <p className="text-sm text-gray-500 text-center py-4">Tidak ada log riwayat.</p>
                                )}
                              </div>
                        </div>
                    )}

                    {/* Sensors Tab */}
                    {activeTab === 'sensors' && (
                        <div className="space-y-3">
                            {/* Sensor Giroskop */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                {/* ... Giroskop JSX (Tidak Berubah) ... */}
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-gray-900">Giroskop</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSensorStatus(giroskop).color}`}>
                                        {getSensorStatus(giroskop).text}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <div className="text-gray-500">X</div>
                                        <div className="font-bold text-gray-900">{giroskop ? giroskop.x.toFixed(3) : '-'}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <div className="text-gray-500">Y</div>
                                        <div className="font-bold text-gray-900">{giroskop ? giroskop.y.toFixed(3) : '-'}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <div className="text-gray-500">Z</div>
                                        <div className="font-bold text-gray-900">{giroskop ? giroskop.z.toFixed(3) : '-'}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600 flex items-center"><BarChartHorizontal className="w-4 h-4 mr-1"/> Akurasi</span>
                                        <span className="text-sm font-bold text-gray-900">{akurasi_gyro ?? 95}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${getAccuracyColor(akurasi_gyro ?? 95)}`}
                                            style={{ width: `${akurasi_gyro ?? 95}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sensor Akselerasi */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                {/* ... Akselerasi JSX (Tidak Berubah) ... */}
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-gray-900">Akselerometer</h4>
                                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSensorStatus(akselerasi).color}`}>
                                    {getSensorStatus(akselerasi).text}
                                  </span>
                                </div>
                                 <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <div className="text-gray-500">X</div>
                                        <div className="font-bold text-gray-900">{akselerasi ? akselerasi.x.toFixed(2) : '-'}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <div className="text-gray-500">Y</div>
                                        <div className="font-bold text-gray-900">{akselerasi ? akselerasi.y.toFixed(2) : '-'}</div>
                                    </div>
                                     <div className="bg-gray-50 rounded-lg p-2 text-center">
                                        <div className="text-gray-500">Z</div>
                                        <div className="font-bold text-gray-900">{akselerasi ? akselerasi.z.toFixed(2) : '-'}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600 flex items-center"><BarChartHorizontal className="w-4 h-4 mr-1"/> Akurasi</span>
                                        <span className="text-sm font-bold text-gray-900">{akurasi_aksel ?? 97}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${getAccuracyColor(akurasi_aksel ?? 97)}`}
                                            style={{ width: `${akurasi_aksel ?? 97}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sensor Jarak (Ultrasonik) */}
                             <div className="bg-white rounded-xl p-5 border border-gray-200">
                                {/* ... Jarak JSX (Tidak Berubah) ... */}
                                 <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-gray-900">Ultrasonik (Jarak)</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSensorStatus(jarak, true).color}`}>
                                        {getSensorStatus(jarak, true).text}
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-gray-900 mb-3">{jarak !== null ? (jarak === -1 ? 'Tidak Terdeteksi' : `${jarak} cm`) : '-'}</div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600 flex items-center"><BarChartHorizontal className="w-4 h-4 mr-1"/> Akurasi</span>
                                        <span className="text-sm font-bold text-gray-900">{akurasi_jarak ?? 98}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${getAccuracyColor(akurasi_jarak ?? 98)}`}
                                            style={{ width: `${akurasi_jarak ?? 98}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ✅ TAMBAHAN: Sensor Kekuatan Sinyal */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-gray-900">Kekuatan Sinyal</h4>
                                    {/* Cek jika sinyal ada dan tidak 0 */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSensorStatus(kekuatan_sinyal, true).color}`}>
                                        {getSensorStatus(kekuatan_sinyal, true).text}
                                    </span>
                                </div>
                                {/* Tampilkan nilai sinyal (misal dalam dBm atau %) */}
                                <div className="text-lg font-bold text-gray-900 mb-3">
                                    {kekuatan_sinyal !== undefined && kekuatan_sinyal !== null ? `${kekuatan_sinyal} dBm` : '-'}
                                </div>
                                {/* Akurasi Sinyal (Placeholder) */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600 flex items-center"><Wifi className="w-4 h-4 mr-1"/> Akurasi Sinyal</span>
                                        {/* Ganti 'akurasi_sinyal ?? 90' dengan data asli jika ada */}
                                        <span className="text-sm font-bold text-gray-900">{akurasi_sinyal ?? 90}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${getAccuracyColor(akurasi_sinyal ?? 90)}`}
                                            style={{ width: `${akurasi_sinyal ?? 90}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}