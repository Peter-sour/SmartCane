import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Preferences } from "@capacitor/preferences"; 

import Dasboard from "./dasboard";
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

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  // 🔍 Deteksi device (mobile vs desktop)
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 🧠 Cek status login dari Preferences (Capacitor)
  useEffect(() => {
    const checkLoginStatus = async () => {
      const { value } = await Preferences.get({ key: "isLoggedIn" });
      setIsLoggedIn(value === "true");
      setCheckingLogin(false);
    };
    checkLoginStatus();
  }, []);

  if (checkingLogin) {
    return <div>Loading...</div>; // ⏳ Tunggu status login dicek dulu
  }

  return (
    <Router>
      <BackHandler />

      <Switch>
        {/* Halaman awal otomatis menyesuaikan login & device */}
        <Route exact path="/">
          {isLoggedIn ? (
            <Redirect to={isMobile ? "/Dasboard" : "/Dasboard"} /> // Bisa kamu ubah kalau mobile mau ke lain
          ) : (
            isMobile ? <Redirect to="/mobilelogin" /> : <Redirect to="/login" />
          )}
        </Route>

        {/* 📱 Versi Mobile */}
        <Route path="/onboarding-mobile" component={OnboardingScreen} />
        <Route path="/mobilelogin" component={MobileLogin} />
        <Route path="/mobileregister" component={MobileRegister} />

        {/* 💻 Versi Desktop */}
        <Route path="/Dasboard" component={Dasboard} />
        <Route path="/log" component={DetailSecurityPage} />
        <Route path="/map" component={MapTracker}/>
        <Route path="/test" component={Test}/>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/user/login" component={UserLogin} />
        <Route path="/user/register" component={RegisterUser} />
        <Route path="/device/login" component={DeviceLogin} />
        <Route path="/landing" component={LandingPage} />
      </Switch>
    </Router>
  );
}

export default App;
