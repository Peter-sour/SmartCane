import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";

export default function RegisterUser() {
  const nav = useHistory();
  const [f, setF] = useState({ name:"", email:"", password:"" });
  const [err, setErr] = useState("");
  const [ok,  setOk] = useState(false);

  function onSubmit(e){
    e.preventDefault();
    const r = registerUser(f);
    if (!r.ok) return setErr(r.error);
    setErr(""); setOk(true);
    setTimeout(()=>nav("/login"), 700);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-cyan-50/40">
      <div className="card w-full max-w-xl">
        <div className="card-header"><div className="font-extrabold text-xl">Daftar</div></div>
        <div className="card-body">
          <form className="space-y-4" onSubmit={onSubmit}>
            {err && <div className="badge bg-red-50 text-red-600">{err}</div>}
            {ok  && <div className="badge bg-emerald-50 text-emerald-600">Akun dibuat. Silakan login.</div>}

            <label className="text-sm">Nama</label>
            <input className="input" value={f.name} onChange={e=>setF(v=>({...v,name:e.target.value}))} required />

            <label className="text-sm">Email</label>
            <input className="input" type="email" value={f.email} onChange={e=>setF(v=>({...v,email:e.target.value}))} required />

            <label className="text-sm">Password</label>
            <input className="input" type="password" value={f.password} onChange={e=>setF(v=>({...v,password:e.target.value}))} required />

            <button className="btn-primary w-full" type="submit">Buat Akun</button>
            <p className="text-sm text-slate-600">
              Sudah punya akun? <Link className="text-sc-primary font-semibold" to="/login">Masuk</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
