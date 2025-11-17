import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Sesuaikan path jika perlu

// Komponen ini membungkus route yang butuh login
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAuth(); // Ambil status login dari Context

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          // 1. Jika sudah login, tampilkan halaman yang diminta
          <Component {...props} />
        ) : (
          // 2. Jika belum login, lempar ke halaman login
          <Redirect to="/mobilelogin" /> // Ganti ke /login jika ini rute login utama
        )
      }
    />
  );
};

export default ProtectedRoute;