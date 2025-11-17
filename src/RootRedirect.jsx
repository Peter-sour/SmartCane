import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Komponen ini bertugas mengarahkan user dari halaman "/"
const RootRedirect = ({ isMobile }) => {
  const { isLoggedIn } = useAuth(); // Ambil status login dari Context

  if (isLoggedIn) {
    // Jika login, arahkan ke dashboard
    return <Redirect to={isMobile ? "/mobiledashboard" : "/dashboard"} />;
  } else {
    // Jika tidak login, arahkan ke onboarding/login
    return <Redirect to={isMobile ? "/onboarding-mobile" : "/login"} />;
  }
};

export default RootRedirect;