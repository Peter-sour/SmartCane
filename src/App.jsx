import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute'; 
import RootRedirect from './RootRedirect'; 
import { SocketProvider, useSocket } from "./context/SocketContext";
import Dashboard from "./dasboard"; 
import DetailSecurityPage from "./log";
import MapTracker from "./MapTracker";
import Test from "./test";
import Login from "./Login/Login";
import Register from "./Login/Register";
import UserLogin from "./Login/UserLogin";
import RegisterUser from "./Login/RegisterUser";
import DeviceLogin from "./pages/DeviceLogin";
import LandingPage from "./pages/LandingPage";
import OnboardingScreen from "./pages/OnboardingScreen";
import MobileLogin from "./mobile/MobileLogin";
import MobileRegister from "./mobile/MobileRegister";
import BackHandler from "./BackHandler";  
import MobileDashboard from "./mobile/MobileDashboard";
import MobileLog from "./mobile/MobileLog";
import MobileAdmin from "./mobile/MobileAdmin";
import MobileAlert from "./mobile/MobileAlert";
import MobileTimeline from "./mobile/MobileTimeline";
import Coba from "./mobile/coba";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  
  // 🛑 HAPUS STATE AUTH LAMA 🛑
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [checkingLogin, setCheckingLogin] = useState(true);

  // 🔍 Deteksi device (Ini sudah benar, biarkan)
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 🛑 HAPUS LOGIKA CEK LOGIN LAMA 🛑
  // useEffect(() => { ... checkLoginStatus ... }, []);
  // (AuthProvider sudah melakukan ini)

  // 🛑 HAPUS 'if (checkingLogin)' 🛑
  // (AuthProvider sudah punya 'isLoading' screen sendiri)

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <BackHandler />
          <Switch>
            {/* Halaman Awal (Root) */}
            <Route exact path="/">
              {/* Gunakan komponen RootRedirect baru */}
              <RootRedirect isMobile={isMobile} />
            </Route>

            {/* --- Rute Publik (Bisa diakses tanpa login) --- */}
            
            {/* 📱 Mobile Publik */}
            <Route path="/onboarding-mobile" component={OnboardingScreen} />
            <Route path="/mobilelogin" component={MobileLogin} />
            <Route path="/mobileregister" component={MobileRegister} />

            {/* 💻 Desktop Publik */}
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/user/login" component={UserLogin} />
            <Route path="/user/register" component={RegisterUser} />
            <Route path="/device/login" component={DeviceLogin} />
            <Route path="/landing" component={LandingPage} />
            <Route path="/mobiletimeline" component={MobileTimeline} />

            {/* --- Rute Terproteksi (Harus login) --- */}
            {/* Gunakan <ProtectedRoute> */}

            {/* 📱 Mobile Terproteksi */}
            <ProtectedRoute path="/mobiledashboard" component={MobileDashboard} />
            <ProtectedRoute path="/mobilelog" component={MobileLog} />
            <ProtectedRoute path="/mobileadmin" component={MobileAdmin} />
            <ProtectedRoute path="/mobilealert" component={MobileAlert} />
            <ProtectedRoute path="/coba" component={Coba} />

            {/* 💻 Desktop Terproteksi */}
            {/* (PERBAIKAN: ganti 'Dasboard' jadi 'dashboard') */}
            <ProtectedRoute path="/dashboard" component={Dashboard} /> 
            <ProtectedRoute path="/log" component={DetailSecurityPage} />
            <ProtectedRoute path="/map" component={MapTracker}/>
            <ProtectedRoute path="/test" component={Test}/>

            
          </Switch>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;