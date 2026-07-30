// server.js
// FleetDash - Core Setup (Week 1) + Live Connection (Week 2)
// Express server + Socket.io broadcasting simulated vehicle coordinates

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 3000;

// Serve the static frontend (public/index.html)
app.use(express.static(path.join(__dirname, "public")));

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FleetDash server is running" });
});

// ---- Simulated Vehicle Fleet ----
// In the real project, this data would come from actual GPS devices.
// For Week 1/2, we simulate a small fleet moving around a base location.

const BASE_LAT = 22.7196; // Indore, as a sample base location
const BASE_LNG = 75.8577;

const vehicles = [
  { id: "TRUCK-01", lat: BASE_LAT, lng: BASE_LNG },
  { id: "TRUCK-02", lat: BASE_LAT + 0.01, lng: BASE_LNG - 0.01 },
  { id: "TRUCK-03", lat: BASE_LAT - 0.008, lng: BASE_LNG + 0.006 },
];

function moveVehicleRandomly(vehicle) {
  // Small random drift to simulate movement
  vehicle.lat += (Math.random() - 0.5) * 0.001;
  vehicle.lng += (Math.random() - 0.5) * 0.001;
  return vehicle;
}

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send the current fleet state immediately on connect
  socket.emit("fleet:init", vehicles);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Broadcast updated vehicle positions every 2 seconds
setInterval(() => {
  vehicles.forEach(moveVehicleRandomly);
  io.emit("fleet:update", vehicles);
}, 2000);

server.listen(PORT, () => {
  console.log(`FleetDash server running on http://localhost:${PORT}`);
});
