import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, login } from "../lib/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await signup({ email, password, display_name: displayName });
      const res = await login({ email, password });
      localStorage.setItem("token", res.access_token);
      navigate("/visualizer");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Signup failed");
    }
  }

  return (
    <div className="grid" style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Create your account</h2>
        <p style={{ color: "var(--muted)" }}>Join and start visualizing audio.</p>
        {err && <div style={{ color: "var(--error)", marginBottom: 12 }}>{err}</div>}
        <form onSubmit={onSubmit} className="grid">
          <label>
            Email
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            Display name
            <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
          </label>
          <label>
            Password
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
          </label>
          <button className="button" type="submit">Create account</button>
        </form>
        <div style={{ marginTop: 12 }}>
          Have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
