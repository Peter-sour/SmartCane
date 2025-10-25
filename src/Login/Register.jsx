import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const API_URL = "http://localhost:5000/api/auth";

export default function Register() {
  const nav = useHistory();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State terpisah untuk masing-masing kolom password
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setOk(false);

    if (!form.name || !form.email || !form.password || !confirmPassword) {
      setErr("Semua field wajib diisi.");
      return;
    }
    
    if (form.password !== confirmPassword) {
      setErr("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = { ...form, id_perangkat: "DUMMY-" + Date.now() };

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
      setTimeout(() => nav.push("/login"), 1500);

    } catch (error) {
      setErr(error.message);
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-cyan-50 px-6 py-10">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-lg w-full max-w-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-3 rounded-xl shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
            Daftar Akun Baru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Isi data diri untuk melanjutkan
          </p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {err && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md border border-red-100">
              {err}
            </div>
          )}
          {ok && (
            <div className="bg-emerald-50 text-emerald-600 text-sm px-3 py-2 rounded-md border border-emerald-100">
              Akun berhasil dibuat. Mengalihkan ke login...
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600">Nama</label>
            <input
              type="text"
              name="name"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
              placeholder="Nama Lengkap Anda"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Kolom Password */}
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <div className="relative">
              <input
                // Menggunakan state showPassword
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full mt-1 pl-3 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                // Menggunakan handler untuk showPassword
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Kolom Konfirmasi Password */}
          <div>
            <label className="text-sm text-slate-600">Konfirmasi Password</label>
            <div className="relative">
              <input
                // Menggunakan state showConfirmPassword
                type={showConfirmPassword ? "text" : "password"}
                className="w-full mt-1 pl-3 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
                placeholder="Ulangi password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                // Menggunakan handler untuk showConfirmPassword
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white py-2 rounded-lg font-semibold shadow-sm hover:shadow-md hover:opacity-90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Mendaftar..." : "Buat Akun"}
          </button>

          <p className="text-center text-sm text-slate-600 mt-3">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}