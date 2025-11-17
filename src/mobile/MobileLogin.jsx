import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { Activity, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useHistory();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // localStorage.setItem("token", data.token);
      // console.log("token",data.token);
      // localStorage.setItem("id_perangkat", data.id_perangkat);
      // await Preferences.set({ key: "isLoggedIn", value: "true" });
      await login(data.token, data);
      nav.push("/mobiledashboard");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8">
      
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-gray-900">SmartCane</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Masuk
        </h1>
        <p className="text-base text-gray-600">
          Pantau dan monitor aktivitas real-time
        </p>
      </div>

      {/* Form */}
      <form className="flex-1 space-y-6" onSubmit={onSubmit}>
        
        {/* Error Message */}
        {err && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{err}</p>
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-base"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-base"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 bg-emerald-500 text-white rounded-full font-bold text-base shadow-lg transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600 active:scale-98"
          }`}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {/* Register Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/mobileregister"
              className="text-emerald-500 font-bold hover:text-emerald-600"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}