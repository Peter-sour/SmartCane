import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";

export default function UserLogin() {
  const nav = useHistory();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const res = loginUser({ email, password });
    if (res.ok) nav("/user");
    else setErr(res.error || "Login gagal");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-cyan-50/40">
      <div className="card w-full max-w-xl">
        <div className="card-header">
          <div className="font-extrabold text-xl">Masuk</div>
        </div>
        <div className="card-body">
          <form className="space-y-4" onSubmit={onSubmit}>
            {err && <div className="badge bg-red-50 text-red-600">{err}</div>}

            <label className="text-sm">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <label className="text-sm">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button className="btn-primary w-full" type="submit">
              Masuk
            </button>

            {/* 🔽 Tambahan di sini */}
            <p className="text-sm text-slate-600 text-center">
              Belum punya akun?{" "}
              <Link to="/register" className="text-sc-primary font-semibold">
                Daftar
              </Link>
              {"  "} | {"  "}
              Admin?{" "}
              <Link to="/admin/login" className="text-sc-primary font-semibold">
                Masuk Admin
              </Link>
            </p>
            {/* 🔼 Selesai */}
          </form>
        </div>
      </div>
    </div>
  );
}
