import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Login() {
  const nav = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function login({ email, password }) {
    if (email === "admin@gmail.com" && password === "123456") {
      return { ok: true };
    } else {
      return { ok: false, error: "Email atau password salah" };
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const res = login({ email, password });
    if (res.ok) nav.push("/dashboard");
    else setErr(res.error || "Login gagal");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-cyan-50 px-6 py-10">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-lg w-full max-w-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-3 rounded-xl shadow-md">
              {/* PERBAIKAN: Mengganti ikon SVG dengan ikon User Circle yang lebih jelas */}
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
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
            Masuk ke Smart Cane
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dashboard Monitoring Sistem
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {err && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md border border-red-100">
              {err}
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white py-2 rounded-lg font-semibold shadow-sm hover:shadow-md hover:opacity-90 transition text-sm"
          >
            Masuk
          </button>

          <p className="text-center text-sm text-slate-600 mt-3">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-cyan-600 font-semibold hover:underline"
            >
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}