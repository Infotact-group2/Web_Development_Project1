/**
 * CanvasMap.jsx
 * A single <canvas> renders the entire fleet. requestAnimationFrame drives
 * the loop; React only mounts the element and wires pan/zoom handlers.
 * Positions are linearly interpolated between server frames so 100ms
 * server ticks look like smooth continuous motion at 60 FPS.
 */
import { useEffect, useRef } from "react";
import { vehicles, stats } from "../lib/telemetryStore";

const CENTER = { lat: 52.52, lng: 13.405 };
const FRAME_INTERVAL_MS = 100; // must match backend broadcastIntervalMs

export default function CanvasMap({ fences, flash }) {
  const canvasRef = useRef(null);
  const view = useRef({ lat: CENTER.lat, lng: CENTER.lng, zoom: 2200 }); // px per degree lng
  const drag = useRef(null);
  const fpsRef = useRef({ frames: 0, last: performance.now() });
  const flashUntil = useRef(0);

  useEffect(() => {
    if (flash) flashUntil.current = performance.now() + 600;
  }, [flash]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const project = (lat, lng) => {
      const v = view.current;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const latScale = v.zoom * 1.6; // rough mercator-ish stretch at 52°N
      return {
        x: w / 2 + (lng - v.lng) * v.zoom,
        y: h / 2 - (lat - v.lat) * latScale
      };
    };

    const draw = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const now = performance.now();

      // background
      ctx.fillStyle = "#0d1321";
      ctx.fillRect(0, 0, w, h);

      // subtle grid
      ctx.strokeStyle = "rgba(120,140,180,0.07)";
      ctx.lineWidth = 1;
      const grid = 0.02 * view.current.zoom;
      for (let x = (w / 2 - view.current.lng * view.current.zoom) % grid; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = (h / 2) % grid; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // geofences
      for (const f of fences) {
        const ring = f.geometry.coordinates[0];
        ctx.beginPath();
        ring.forEach(([lng, lat], i) => {
          const p = project(lat, lng);
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        const flashing = now < flashUntil.current;
        ctx.fillStyle = flashing ? "rgba(255,92,92,0.25)" : "rgba(255,176,32,0.08)";
        ctx.strokeStyle = flashing ? "#ff5c5c" : "#ffb020";
        ctx.lineWidth = flashing ? 2.5 : 1.5;
        ctx.fill();
        ctx.stroke();
        const first = project(ring[0][1], ring[0][0]);
        ctx.fillStyle = "#ffb020";
        ctx.font = "11px 'IBM Plex Mono', monospace";
        ctx.fillText(f.name.toUpperCase(), first.x + 6, first.y - 6);
      }

      // vehicles — interpolated between server frames
      let visible = 0;
      for (const v of vehicles.values()) {
        const t = Math.min(1, (now - v.lastFrameAt) / FRAME_INTERVAL_MS);
        const lat = v.plat + (v.lat - v.plat) * t;
        const lng = v.plng + (v.lng - v.plng) * t;
        const p = project(lat, lng);
        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) continue;
        visible++;
        // speed-tinted dot: slow=steel, fast=amber
        const fast = Math.min(1, v.speed / 90);
        ctx.fillStyle = `rgb(${110 + fast * 145}, ${150 + fast * 26}, ${210 - fast * 178})`;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }

      // HUD
      fpsRef.current.frames++;
      if (now - fpsRef.current.last >= 1000) {
        stats.fps = fpsRef.current.frames;
        fpsRef.current.frames = 0;
        fpsRef.current.last = now;
      }
      ctx.fillStyle = "rgba(13,19,33,0.85)";
      ctx.fillRect(12, 12, 240, 66);
      ctx.strokeStyle = "rgba(120,140,180,0.25)";
      ctx.strokeRect(12, 12, 240, 66);
      ctx.fillStyle = "#e8ecf4";
      ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText(`FPS        ${stats.fps}`, 24, 32);
      ctx.fillText(`VEHICLES   ${vehicles.size} (${visible} in view)`, 24, 48);
      ctx.fillText(`LINK       ${stats.connected ? "LIVE" : "OFFLINE"}`, 24, 64);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // pan + zoom
    const down = (e) => (drag.current = { x: e.clientX, y: e.clientY });
    const up = () => (drag.current = null);
    const move = (e) => {
      if (!drag.current) return;
      const v = view.current;
      v.lng -= (e.clientX - drag.current.x) / v.zoom;
      v.lat += (e.clientY - drag.current.y) / (v.zoom * 1.6);
      drag.current = { x: e.clientX, y: e.clientY };
    };
    const wheel = (e) => {
      e.preventDefault();
      view.current.zoom = Math.max(300, Math.min(60000, view.current.zoom * (e.deltaY < 0 ? 1.15 : 0.87)));
    };
    canvas.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    canvas.addEventListener("wheel", wheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
      canvas.removeEventListener("wheel", wheel);
    };
  }, [fences]);

  return <canvas ref={canvasRef} className="map-canvas" />;
}
