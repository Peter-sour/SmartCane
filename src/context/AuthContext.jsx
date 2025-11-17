import React, { createContext, useState, useEffect, useContext } from 'react';
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from "jwt-decode"; // Install: npm install jwt-decode

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Provider (yang akan "membungkus" aplikasi Anda)
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Akan berisi { email, id, dll. }
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Untuk loading awal

  // 3. Fungsi untuk mengecek auth saat aplikasi pertama kali dibuka
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // Ambil token dari localStorage
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          // Decode token untuk dapat data user & cek kadaluarsa
          const decodedToken = jwtDecode(storedToken);
          
          // Cek apakah token sudah kadaluarsa (exp = expired time)
          const isExpired = decodedToken.exp * 1000 < Date.now();

          if (isExpired) {
            // Jika kadaluarsa, logout
            console.log("Token kadaluarsa, logout.");
            await logout();
          } else {
            // Jika valid, set state
            console.log("Token valid, user login.");
            setToken(storedToken);
            setUser({ 
              email: decodedToken.email, // Asumsi email ada di token
              id: decodedToken.id        // Asumsi id ada di token
            });
            setIsLoggedIn(true);
            await Preferences.set({ key: "isLoggedIn", value: "true" });
          }
        } else {
          // Tidak ada token, pastikan logout
          await logout();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        await logout(); // Jika token invalid, paksa logout
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialAuth();
  }, []);

  // 4. Fungsi Login
  const login = async (newToken, userData) => {
    try {
      // Decode token untuk data user
      const decodedToken = jwtDecode(newToken);

      // Simpan data ke state
      setToken(newToken);
      setUser({
        email: decodedToken.email, // Ambil dari token
        id: decodedToken.id       // Ambil dari token
      });
      setIsLoggedIn(true);
      
      // Simpan HANYA token ke localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("id_perangkat", decodedToken.id_perangkat); // Simpan id perangkat
      
      // Set preferences
      await Preferences.set({ key: "isLoggedIn", value: "true" });

    } catch (error) {
      console.error("Login gagal di context:", error);
    }
  };

  // 5. Fungsi Logout
  const logout = async () => {
    // Hapus dari state
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    
    // Hapus dari penyimpanan
    localStorage.removeItem("token");
    localStorage.removeItem("id_perangkat");
    localStorage.removeItem("userEmail"); // (Sudah tidak dipakai)
    
    await Preferences.set({ key: "isLoggedIn", value: "false" });
  };

  // 6. Jika masih loading, tampilkan loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Anda bisa ganti dengan logo/spinner */}
        <p>Memuat...</p> 
      </div>
    );
  }

  // 7. Berikan nilai ke "pembungkus"
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 8. Buat custom hook agar gampang dipakai
export const useAuth = () => {
  return useContext(AuthContext);
};