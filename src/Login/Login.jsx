import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Login() {
  const nav = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("id_perangkat", data.id_perangkat);

      nav.push("/dashboard");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-md w-full max-w-sm p-8">
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
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-700">
            Masuk ke Smart Cane
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Dashboard Monitoring Sistem
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {err && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md border border-red-100 text-center">
              {err}
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
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
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white py-2 rounded-lg font-semibold shadow-sm hover:shadow-md transition text-sm ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
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