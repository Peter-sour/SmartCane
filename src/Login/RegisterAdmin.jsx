import { useState } from "react";
// Perubahan 1: Impor useHistory, bukan useNavigate
import { useHistory, Link } from "react-router-dom";

export default function LoginAdmin() {
  // Perubahan 2: Gunakan useHistory()
  const history = useHistory();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setErr(""); // Dummy auth — nanti bisa kamu ganti ke API backend
    if (f.email === "admin@gmail.com" && f.password === "123456") {
      // Perubahan 3: Gunakan history.push() untuk navigasi
      history.push("/admin/dashboard");
    } else {
      setErr("Email atau password salah.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-sky-50 to-cyan-50 px-4 py-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="text-3xl font-extrabold text-slate-800">
            Smart Cane
          </div>
          <div className="text-slate-500 text-sm mt-1">Dashboard Monitoring</div>
        </div>
        <h2 className="text-center text-xl font-bold text-slate-800 mb-6">
          Masuk Admin
        </h2>

        {/* Form dan elemen JSX lainnya sama persis, 
          tidak ada perubahan di bawah ini 
        */}
        <form onSubmit={onSubmit} className="space-y-5">
          {err && (
            <div className="bg-red-100 text-red-700 text-sm p-2 rounded-md border border-red-200">
              {err}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={f.password}
              onChange={(e) => setF({ ...f, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-md transition-colors"
          >
            Masuk
          </button>

          <p className="text-center text-sm text-slate-600">
            Belum punya akun?{" "}
            <Link
              to="/admin/register"
              className="text-sky-600 font-semibold hover:underline"
            >
              Daftar Admin
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}