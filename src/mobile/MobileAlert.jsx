import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  ArrowLeft, AlertTriangle, CheckCircle, XCircle, Info,
  Filter, Search, Download, RefreshCw, Calendar,
  MapPin, User, Smartphone, Clock, ChevronDown
} from 'lucide-react';

export default function AlertManagement() {
  const history = useHistory();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Data dummy alerts dari semua user
  const allAlerts = [
    {
      id: 1,
      device: 'SC-001',
      user: 'Ahmad Rizki',
      type: 'warning',
      title: 'Baterai Rendah',
      description: 'Level baterai mencapai 15%, segera charge',
      location: 'Jl. Raya Gubeng No. 123',
      time: '10 menit lalu',
      timestamp: '2025-09-23T22:40:00',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 2,
      device: 'SC-005',
      user: 'Rina Wijaya',
      type: 'error',
      title: 'Koneksi Terputus',
      description: 'Perangkat kehilangan koneksi GPS selama 45 detik',
      location: 'Koordinat terakhir: -7.25764, 112.75246',
      time: '25 menit lalu',
      timestamp: '2025-09-23T22:25:00',
      status: 'resolved',
      priority: 'high'
    },
    {
      id: 3,
      device: 'SC-003',
      user: 'Budi Santoso',
      type: 'success',
      title: 'Kalibrasi Selesai',
      description: 'Sistem berhasil melakukan kalibrasi otomatis',
      location: 'Jl. Diponegoro No. 45',
      time: '1 jam lalu',
      timestamp: '2025-09-23T21:50:00',
      status: 'resolved',
      priority: 'low'
    },
    {
      id: 4,
      device: 'SC-007',
      user: 'Dewi Lestari',
      type: 'warning',
      title: 'Rintangan Terdeteksi',
      description: 'Objek dengan jarak 0.3m terdeteksi di depan',
      location: 'Jl. Basuki Rahmat No. 89',
      time: '2 jam lalu',
      timestamp: '2025-09-23T20:50:00',
      status: 'resolved',
      priority: 'high'
    },
    {
      id: 5,
      device: 'SC-002',
      user: 'Siti Aminah',
      type: 'info',
      title: 'Update Firmware',
      description: 'Pembaruan firmware tersedia (v2.1.5)',
      location: '-',
      time: '3 jam lalu',
      timestamp: '2025-09-23T19:50:00',
      status: 'active',
      priority: 'low'
    },
    {
      id: 6,
      device: 'SC-012',
      user: 'Joko Widodo',
      type: 'error',
      title: 'Sensor Error',
      description: 'Sensor ultrasonik tidak merespons',
      location: 'Jl. Pemuda No. 156',
      time: '4 jam lalu',
      timestamp: '2025-09-23T18:50:00',
      status: 'active',
      priority: 'high'
    },
    {
      id: 7,
      device: 'SC-009',
      user: 'Linda Sari',
      type: 'warning',
      title: 'Suhu Tinggi',
      description: 'Suhu perangkat mencapai 45°C',
      location: 'Jl. Ahmad Yani No. 234',
      time: '5 jam lalu',
      timestamp: '2025-09-23T17:50:00',
      status: 'resolved',
      priority: 'medium'
    },
    {
      id: 8,
      device: 'SC-015',
      user: 'Hadi Prasetyo',
      type: 'info',
      title: 'Mode Malam Aktif',
      description: 'Sistem otomatis mengaktifkan mode malam',
      location: 'Jl. Sudirman No. 67',
      time: '6 jam lalu',
      timestamp: '2025-09-23T16:50:00',
      status: 'resolved',
      priority: 'low'
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      case 'success': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-gray-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  // Filter alerts
  const filteredAlerts = allAlerts.filter(alert => {
    const matchType = filterType === 'all' || alert.type === filterType;
    const matchStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchSearch = searchQuery === '' || 
      alert.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchType && matchStatus && matchSearch;
  });

  // Stats
  const stats = {
    total: allAlerts.length,
    active: allAlerts.filter(a => a.status === 'active').length,
    resolved: allAlerts.filter(a => a.status === 'resolved').length,
    highPriority: allAlerts.filter(a => a.priority === 'high').length
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => history.push('/admin/dashboard')}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Manajemen Alert</h1>
                <p className="text-xs text-gray-500">Semua notifikasi & peringatan</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-95 transition">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-amber-600">{stats.active}</div>
            <p className="text-xs text-gray-600 mt-1">Aktif</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-emerald-600">{stats.resolved}</div>
            <p className="text-xs text-gray-600 mt-1">Selesai</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-red-600">{stats.highPriority}</div>
            <p className="text-xs text-gray-600 mt-1">Prioritas</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari user, device, atau alert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-sm"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-700"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Tipe Alert</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="warning">Peringatan</option>
                  <option value="error">Error</option>
                  <option value="success">Sukses</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="resolved">Selesai</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-bold text-gray-900">{filteredAlerts.length}</span> dari {allAlerts.length} alert
          </p>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`rounded-xl p-4 border ${getTypeColor(alert.type)}`}>
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(alert.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-sm">{alert.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getPriorityBadge(alert.priority)}`}>
                          {alert.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mb-2">{alert.description}</p>
                    </div>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                      alert.status === 'active' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-gray-400 text-white'
                    }`}>
                      {alert.status === 'active' ? 'AKTIF' : 'SELESAI'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs opacity-75 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{alert.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Smartphone className="w-3 h-3" />
                      <span>{alert.device}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.time}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {alert.status === 'active' && (
                    <button className="text-xs font-bold underline opacity-90 hover:opacity-100">
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak Ada Alert</h3>
            <p className="text-sm text-gray-600">Tidak ada alert yang sesuai dengan filter</p>
          </div>
        )}

      </div>
    </div>
  );
}