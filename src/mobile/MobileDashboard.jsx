import React, { useEffect, useState } from "react";
import { Battery, MapPin, Activity, Clock, Menu, Bell, User } from 'lucide-react';
import { useHistory } from "react-router-dom";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

export default function Dashboard() {
  const history = useHistory();

  const goToLog = () => {
    history.push("/mobilelog");
  };

  // Data dummy
  const distance = 1.8;
  const battery = 75;
  const statusText = "Aman";

  const getBatteryColor = (percentage) => {
    if (percentage > 60) return 'bg-emerald-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });

  useEffect(() => {
    let intervalId;

    const updateLocation = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await Geolocation.requestPermissions();
          const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              });
            },
            (err) => console.error("Error (Web):", err),
            { enableHighAccuracy: true }
          );
        }
      } catch (err) {
        console.error("Error getting location:", err);
      }
    };

    intervalId = setInterval(updateLocation, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
            <div className="flex items-center space-x-2">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-4">

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Status Perangkat</h2>
              <p className="text-sm text-gray-500">Update real-time</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
              {statusText}
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
                <span className="text-3xl font-black text-blue-900">{distance}</span>
                <span className="text-sm text-blue-700 mb-1">m</span>
              </div>
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

        {/* Activity Log */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Log Aktivitas</h2>
                <p className="text-xs text-gray-500">Riwayat terbaru</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Belum ada aktivitas</p>
            <p className="text-xs text-gray-500 mb-4">Log akan muncul secara real-time</p>
            <button 
              onClick={goToLog}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold active:scale-98 transition"
            >
              Lihat Detail
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white border border-gray-200 rounded-xl p-4 text-center active:scale-95 transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-sm font-bold text-gray-900">Statistik</div>
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
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Sistem Aktif</span>
            </div>
            <span className="text-gray-500">SmartCane v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}