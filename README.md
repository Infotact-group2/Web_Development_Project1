# FleetDash — Fleet Telemetry Dashboard

Real-time fleet tracking dashboard built with Node.js, Express, and Socket.io.

## Progress so far (Week 1 & Week 2)

**Week 1 — Core Setup**
- Basic Express server set up (`server.js`)
- Static frontend scaffold created (`public/index.html`)
- Health check route added (`/api/health`)

**Week 2 — Live Connection**
- Socket.io integrated on both server and client
- Server simulates a small fleet of vehicles and broadcasts position
  updates every 2 seconds (`fleet:update` event)
- Frontend connects via Socket.io client and renders live vehicle
  positions on a simple map area, plus a data table

## How to run

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

## Next steps (Week 3 & 4)

- Replace simulated data with real/more realistic coordinate data
- Add MongoDB to persist vehicle history
- Add geofencing logic (Turf.js) to detect zone breaches
- Improve map rendering (e.g. Leaflet or Canvas-based rendering)
- Add basic tests

## Tech stack

- Backend: Node.js, Express, Socket.io
- Frontend: HTML/CSS/JavaScript (Socket.io client)
