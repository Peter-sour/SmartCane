import React, { createContext, useState, useEffect, useContext } from 'react';
import { Preferences } from '@capacitor/preferences';
import { jwtDecode } from "jwt-decode"; 

// 1. Buat Context
const AuthContext = createContext();

// 2. Buat Provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  // 3. Fungsi Check Auth Awal
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          const isExpired = decodedToken.exp * 1000 < Date.now();

          if (isExpired) {
            console.log("Token kadaluarsa, logout.");
            await logout();
          } else {
            console.log("Token valid, user login.");
            setToken(storedToken);
            
            // ✅ PERBAIKAN 1: Masukkan id_perangkat ke dalam state user saat load awal
            setUser({ 
              email: decodedToken.email, 
              id: decodedToken.id,
              id_perangkat: decodedToken.id_perangkat // Ambil dari token
            });
            
            setIsLoggedIn(true);
            await Preferences.set({ key: "isLoggedIn", value: "true" });
          }
        } else {
          await logout();
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        await logout(); 
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialAuth();
  }, []);

  // 4. Fungsi Login
  const login = async (newToken, userData) => {
    try {
      const decodedToken = jwtDecode(newToken);

      setToken(newToken);
      
      // ✅ PERBAIKAN 2: Masukkan id_perangkat ke dalam state user saat login
      setUser({
        email: decodedToken.email, 
        id: decodedToken.id,
        id_perangkat: decodedToken.id_perangkat // Ambil dari token
      });
      
      setIsLoggedIn(true);
      
      localStorage.setItem("token", newToken);
      // Simpan juga id_perangkat ke localStorage biar aman buat backup
      localStorage.setItem("id_perangkat", decodedToken.id_perangkat); 
      
      await Preferences.set({ key: "isLoggedIn", value: "true" });

    } catch (error) {
      console.error("Login gagal di context:", error);
    }
  };

  // 5. Fungsi Logout
  const logout = async () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    
    localStorage.removeItem("token");
    localStorage.removeItem("id_perangkat");
    
    await Preferences.set({ key: "isLoggedIn", value: "false" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat...</p> 
      </div>
    );
  }

  // 7. Berikan nilai ke pembungkus
  return (
    // ✅ PERBAIKAN 3: Hapus 'id_perangkat' yang berdiri sendiri karena error undefined.
    // Cukup kirim 'user', karena 'id_perangkat' sudah ada di dalam 'user'.
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 8. Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};