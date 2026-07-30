import { useEffect, useState, useCallback } from "react";
import CanvasMap from "./components/CanvasMap";
import AlertFeed from "./components/AlertFeed";
import { connect, onAlert } from "./lib/telemetryStore";

const API = "http://localhost:4000";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [fences, setFences] = useState([]);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    connect(API);
    const off = onAlert((a) => {
      setAlerts((prev) => [a, ...prev].slice(0, 50)); // low-frequency: safe as React state
      if (a.type === "ENTER") setFlash(Date.now());
    });
    fetch(`${API}/api/geofences`).then((r) => r.json()).then(setFences).catch(() => {});
    return () => { off(); };
  }, []);

  const addDemoFence = useCallback(async () => {
    // ~3km square in central Berlin
    await fetch(`${API}/api/geofences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `zone-${fences.length + 1}`,
        coordinates: [
          [13.38, 52.505],
          [13.43, 52.505],
          [13.43, 52.535],
          [13.38, 52.535]
        ]
      })
    });
    const list = await fetch(`${API}/api/geofences`).then((r) => r.json());
    setFences(list);
  }, [fences.length]);

  return (
    <div className="shell">
      <header>
        <div className="brand">
          <span className="mark">▰▰</span> FLEETDASH
        </div>
        <div className="sub">live telemetry · binary transport · bucket-pattern storage</div>
        <button onClick={addDemoFence}>Add demo geofence</button>
      </header>
      <main>
        <CanvasMap fences={fences} flash={flash} />
        <AlertFeed alerts={alerts} />
      </main>
    </div>
  );
}
