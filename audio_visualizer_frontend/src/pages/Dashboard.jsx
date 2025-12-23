import React, { useEffect, useState } from "react";
import { me, listConfigs } from "../lib/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function load() {
      try {
        if (token) {
          const p = await me();
          setProfile(p);
          const c = await listConfigs();
          setConfigs(c);
        }
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <p style={{ color: "var(--muted)" }}>Welcome to the Audio Visualizer.</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/visualizer" className="button">Open Visualizer</Link>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Profile</h3>
          {profile ? (
            <div>
              <div><strong>Email:</strong> {profile.email}</div>
              <div><strong>Name:</strong> {profile.display_name || "—"}</div>
              <div><strong>Joined:</strong> {new Date(profile.created_at).toLocaleString()}</div>
            </div>
          ) : (
            <div>Please sign in to see your profile.</div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Saved Configurations</h3>
          {profile ? (
            configs.length ? (
              <ul>
                {configs.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            ) : (
              <div>No configs yet.</div>
            )
          ) : (
            <div>Sign in to view your configs.</div>
          )}
        </div>
      </div>
    </div>
  );
}
