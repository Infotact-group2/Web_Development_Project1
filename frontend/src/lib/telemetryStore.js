/**
 * telemetryStore.js
 * The core trick that keeps 60 FPS: incoming binary frames are decoded
 * straight into a plain Map that lives OUTSIDE React. No setState, no
 * re-render per frame, no DOM nodes per vehicle. The Canvas render loop
 * reads this store on its own requestAnimationFrame clock.
 *
 * Vehicle record shape:
 *   { id, lat, lng, heading, speed, plat, plng, lastFrameAt }
 *   (plat/plng = previous position, used for interpolation between frames)
 *
 * Alert shape:
 *   { type: "ENTER"|"EXIT", vehicleId, fence, lat, lng, ts }
 */
import { io } from "socket.io-client";

const RECORD_SIZE = 20;

export const vehicles = new Map();
export const stats = { fps: 0, frameCount: 0, lastFrameSize: 0, connected: false };

const alertHandlers = new Set();
export function onAlert(fn) {
  alertHandlers.add(fn);
  return () => alertHandlers.delete(fn);
}

let socket = null;

export function connect(url = "http://localhost:4000") {
  if (socket) return socket;
  socket = io(url, { transports: ["websocket"] });

  socket.on("connect", () => (stats.connected = true));
  socket.on("disconnect", () => (stats.connected = false));

  socket.on("telemetry:frame", (frame) => {
    const view = new DataView(frame);
    const count = Math.floor(frame.byteLength / RECORD_SIZE);
    const now = performance.now();
    for (let i = 0; i < count; i++) {
      const o = i * RECORD_SIZE;
      const id = view.getUint32(o, true);
      const lat = view.getFloat32(o + 4, true);
      const lng = view.getFloat32(o + 8, true);
      const heading = view.getFloat32(o + 12, true);
      const speed = view.getFloat32(o + 16, true);
      const existing = vehicles.get(id);
      if (existing) {
        existing.plat = existing.lat;
        existing.plng = existing.lng;
        existing.lat = lat;
        existing.lng = lng;
        existing.heading = heading;
        existing.speed = speed;
        existing.lastFrameAt = now;
      } else {
        vehicles.set(id, { id, lat, lng, plat: lat, plng: lng, heading, speed, lastFrameAt: now });
      }
    }
    stats.frameCount++;
    stats.lastFrameSize = count;
  });

  socket.on("geofence:alert", (a) => {
    alertHandlers.forEach((fn) => fn(a));
  });

  return socket;
}
