import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaCogs, FaRocket } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-extrabold text-gray-800 tracking-wider">
            Smart<span className="text-indigo-600">Cane</span>
          </Link>
          <nav className="space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
            >
              Masuk
            </Link>
            <Link 
              to="/register" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-md shadow-indigo-200/50"
            >
              Daftar Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. HERO SECTION (Gradien & Fokus) */}
      <main className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="inline-block bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Inovasi Digital
          </p>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Tongkat Pintar, <br className="hidden sm:inline"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">
              Hidup Tanpa Batas
            </span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Integrasi IoT revolusioner untuk keamanan, kemandirian, dan pemantauan kesehatan pengguna disabilitas visual secara *real-time*.
          </p>
          
          <div className="mt-10 flex justify-center space-x-4">
            <Link 
              to="/register" 
              className="px-10 py-3 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-400/50 hover:from-indigo-700 hover:to-cyan-600 transition transform hover:scale-[1.02]"
            >
              Mulai Monitoring
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-3 text-lg font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-md hover:bg-gray-50 transition"
            >
              Masuk
            </Link>
          </div>
        </div>
        {/* Latar Belakang Desain Abstrak */}
        <div className="absolute inset-0 opacity-10">
            <div className="w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 absolute top-0 left-0 animate-blob"></div>
            <div className="w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 absolute bottom-0 right-0 animate-blob animation-delay-2000"></div>
        </div>
      </main>

      {/* 3. FEATURE SECTION (Minimalis & Ikonografi) */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Dibangun untuk Keandalan
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            Teknologi canggih yang bekerja di belakang layar untuk memberikan informasi yang Anda butuhkan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Kartu Fitur 1 */}
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition transform hover:shadow-2xl hover:scale-[1.01]">
              <div className="inline-flex p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <FaLaptopCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Interaktif</h3>
              <p className="text-gray-500">
                Akses semua data perangkat dan lokasi secara visual dan mudah dipahami.
              </p>
            </div>
            
            {/* Kartu Fitur 2 */}
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition transform hover:shadow-2xl hover:scale-[1.01]">
              <div className="inline-flex p-3 rounded-full bg-cyan-100 text-cyan-600 mb-4">
                <FaCogs className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Integrasi API Mulus</h3>
              <p className="text-gray-500">
                Koneksi *backend* yang efisien dan aman untuk transfer data *real-time* tanpa latensi.
              </p>
            </div>
            
            {/* Kartu Fitur 3 */}
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition transform hover:shadow-2xl hover:scale-[1.01]">
              <div className="inline-flex p-3 rounded-full bg-pink-100 text-pink-600 mb-4">
                <FaRocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skalabilitas Tinggi</h3>
              <p className="text-gray-500">
                Arsitektur dirancang untuk mendukung banyak perangkat tanpa mengorbankan performa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Bawah */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white">
            Siap Memulai Monitoring Anda?
          </h2>
          <p className="mt-4 text-xl text-indigo-100">
            Bergabunglah dengan platform SmartCane hari ini.
          </p>
          <Link 
            to="/register" 
            className="mt-8 inline-block px-10 py-3 text-lg font-bold text-indigo-700 bg-white rounded-xl shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p className="font-semibold text-white mb-2">SmartCane</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/about" className="hover:text-indigo-400">Tentang Kami</Link>
            <Link to="/contact" className="hover:text-indigo-400">Hubungi Kami</Link>
            <Link to="/privacy" className="hover:text-indigo-400">Kebijakan Privasi</Link>
          </div>
          <p className="mt-4 text-xs">&copy; {new Date().getFullYear()} SmartCane. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}