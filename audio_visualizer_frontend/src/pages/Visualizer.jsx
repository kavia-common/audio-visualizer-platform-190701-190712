import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { createConfig, listConfigs, updateConfig, deleteConfig } from "../lib/api";

export default function Visualizer() {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [micStream, setMicStream] = useState(null);
  const [configs, setConfigs] = useState([]);
  const [name, setName] = useState("My Visualizer");
  const [currentConfigId, setCurrentConfigId] = useState(null);

  useEffect(() => {
    // load configs on mount
    (async () => {
      try {
        const cs = await listConfigs();
        setConfigs(cs);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    // initialize WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#93c5fd",
      progressColor: "#3b82f6",
      cursorColor: "#06b6d4",
      barWidth: 2,
      barRadius: 2,
      height: 140,
    });
    return () => {
      try {
        wavesurferRef.current?.destroy();
      } catch {}
    };
  }, []);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file || !wavesurferRef.current) return;
    const url = URL.createObjectURL(file);
    await wavesurferRef.current.load(url);
  }

  async function togglePlay() {
    wavesurferRef.current?.playPause();
  }

  async function startMic() {
    if (micStream) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      // load mic stream
      if (wavesurferRef.current) {
        await wavesurferRef.current.load(stream);
      }
    } catch (e) {
      alert("Microphone access denied");
    }
  }

  function stopMic() {
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      setMicStream(null);
    }
  }

  async function onSave() {
    const payload = {
      name,
      config: {
        waveColor: "#93c5fd",
        progressColor: "#3b82f6",
        barWidth: 2,
        height: 140,
      },
    };
    if (currentConfigId) {
      const updated = await updateConfig(currentConfigId, payload);
      setConfigs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } else {
      const created = await createConfig(payload);
      setConfigs((prev) => [created, ...prev]);
      setCurrentConfigId(created.id);
    }
  }

  async function removeConfig(id) {
    await deleteConfig(id);
    setConfigs((prev) => prev.filter((c) => c.id !== id));
    if (currentConfigId === id) setCurrentConfigId(null);
  }

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Audio Visualizer</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <input type="file" accept="audio/*" onChange={handleFile} />
          <button className="button" onClick={togglePlay}>Play / Pause</button>
          {!micStream ? (
            <button className="button secondary" onClick={startMic}>Use Microphone</button>
          ) : (
            <button className="button ghost" onClick={stopMic}>Stop Mic</button>
          )}
        </div>
        <div ref={containerRef} />
      </div>

      <div className="card">
        <div className="header-row">
          <h3 style={{ marginTop: 0 }}>Save Configuration</h3>
          <button className="button" onClick={onSave}>Save</button>
        </div>
        <div className="grid two">
          <label>
            Name
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Selected ID
            <input className="input" value={currentConfigId || ""} onChange={() => {}} disabled />
          </label>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Your Configurations</h3>
        {configs.length ? (
          <ul>
            {configs.map((c) => (
              <li key={c.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="button ghost" onClick={() => { setName(c.name); setCurrentConfigId(c.id); }}>
                  Load
                </button>
                <span style={{ flex: 1 }}>{c.name}</span>
                <button className="button ghost" onClick={() => removeConfig(c.id)} style={{ color: "var(--error)" }}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>No saved configurations yet.</div>
        )}
      </div>
    </div>
  );
}
