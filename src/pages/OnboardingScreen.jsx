import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MapPin, Activity, Bell, Move } from 'lucide-react';

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory();

  const slides = [
    {
      icon: <Activity className="w-32 h-32" strokeWidth={1.5} />,
      title: "SmartCane",
      description: "Platform monitoring tongkat pintar berbasis IoT untuk kemandirian dan keamanan maksimal",
      color: "text-emerald-500"
    },
    {
      icon: <MapPin className="w-32 h-32" strokeWidth={1.5} />,
      title: "Pantau Lokasi Real-Time",
      description: "Ketahui posisi orang tersayang kapan saja dengan teknologi GPS yang akurat dan terpercaya",
      color: "text-blue-500"
    },
    {
      icon: <Move className="w-32 h-32" strokeWidth={1.5} />,
      title: "Monitor Aktivitas",
      description: "Deteksi otomatis aktivitas seperti berjalan, jatuh, atau bergoyang untuk memastikan keamanan setiap saat",
      color: "text-red-500"
    },
    {
      icon: <Bell className="w-32 h-32" strokeWidth={1.5} />,
      title: "Notifikasi Darurat",
      description: "Dapatkan alert instan saat terdeteksi kondisi tidak normal atau tombol SOS ditekan",
      color: "text-orange-500"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      window.history.pushState({ slide: currentSlide + 1 }, "");
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      history.goBack(); // keluar ke halaman sebelumnya
    }
  };

  const handleLogin = () => history.push('/mobilelogin');
  const handleRegister = () => history.push('/mobileregister');

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  // Deteksi tombol back Android (browser back)
  useEffect(() => {
    window.history.pushState({ slide: currentSlide }, "");
    const handlePopState = (e) => {
      if (currentSlide > 0) {
        setCurrentSlide((prev) => prev - 1);
        window.history.pushState({ slide: currentSlide - 1 }, "");
      } else {
        history.goBack();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentSlide, history]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {!isLastSlide && (
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={() => setCurrentSlide(slides.length - 1)}
            className="text-gray-400 hover:text-gray-600 font-semibold text-sm transition"
          >
            Lewati
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12">
        <div className={`${currentSlideData.color} mb-12 transition-all duration-500`}>
          {currentSlideData.icon}
        </div>

        <div className="text-center max-w-md mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentSlideData.title}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            {currentSlideData.description}
          </p>
        </div>

        {isLastSlide ? (
          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={handleRegister}
              className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-base shadow-lg active:scale-98 transition-all"
            >
              Daftar Sekarang
            </button>
            <button
              onClick={handleLogin}
              className="w-full px-6 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-full font-bold text-base active:scale-98 transition-all"
            >
              Masuk
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold text-base shadow active:scale-98 transition-all"
              >
                Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-12 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-base shadow-lg active:scale-98 transition-all"
            >
              Lanjut
            </button>
          </div>
        )}
      </div>

      <div className="pb-8 px-8">
        <div className="flex items-center justify-center space-x-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-emerald-500' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
        <style>{`
        .active-scale-98:active {
            transform: scale(0.98);
        }
        `}</style>

    </div>
  );
}