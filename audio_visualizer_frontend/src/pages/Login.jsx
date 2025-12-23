import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.access_token);
      navigate("/visualizer");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="grid" style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        <p style={{ color: "var(--muted)" }}>Sign in to continue.</p>
        {err && <div style={{ color: "var(--error)", marginBottom: 12 }}>{err}</div>}
        <form onSubmit={onSubmit} className="grid">
          <label>
            Email
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          <button className="button" type="submit">Login</button>
        </form>
        <div style={{ marginTop: 12 }}>
          No account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}
