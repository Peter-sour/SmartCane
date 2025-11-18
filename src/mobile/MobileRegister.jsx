import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// Menambahkan ikon Box untuk ID Perangkat
import { Activity, User, Mail, Lock, Eye, EyeOff, Box } from "lucide-react"; 

const API_URL = "https://mollusklike-intactly-kennedi.ngrok-free.dev/api/auth";

export default function Register() {
  const nav = useHistory();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    id_perangkat: "" // Menambahkan state id_perangkat
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setOk(false);

    // Validasi Field Wajib (Sekarang termasuk id_perangkat)
    if (!form.name || !form.email || !form.password || !confirmPassword || !form.id_perangkat) {
      setErr("Semua field wajib diisi.");
      return;
    }
    
    if (form.password !== confirmPassword) {
      setErr("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      // Data yang dikirim langsung dari state form, yang sudah termasuk id_perangkat
      const dataToSend = { 
          name: form.name,
          email: form.email,
          password: form.password,
          id_perangkat: form.id_perangkat 
      };

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), 
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal. Coba lagi.");
      }

      setOk(true);
      setErr("");
      setTimeout(() => nav.push("/mobilelogin"), 1500);

    } catch (error) {
      console.error(error);
      setErr(error.message);
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-gray-900">SmartCane</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Daftar Akun Baru
        </h1>
        <p className="text-base text-gray-600">
          Isi data diri untuk melanjutkan
        </p>
      </div>

      {/* Form */}
      <form className="flex-1 space-y-5" onSubmit={submit}>
        
        {/* Error Message */}
        {err && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{err}</p>
          </div>
        )}

        {/* Success Message */}
        {ok && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <p className="text-sm text-emerald-600">Akun berhasil dibuat. Mengalihkan ke login...</p>
          </div>
        )}

        {/* Name Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-base"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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
              name="email"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-base"
              placeholder="Masukkan email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {/* ID Perangkat Input BARU */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ID Perangkat
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Box className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="id_perangkat"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-base"
              placeholder="Contoh: SN-123456"
              value={form.id_perangkat}
              onChange={handleChange}
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
              name="password"
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-base"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
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

        {/* Confirm Password Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Konfirmasi Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition text-base"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
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
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600 active-scale-98"
          }`}
        >
          {loading ? "Mendaftar..." : "Buat Akun"}
        </button>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/mobilelogin"
              className="text-emerald-500 font-bold hover:text-emerald-600"
            >
              Masuk
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}