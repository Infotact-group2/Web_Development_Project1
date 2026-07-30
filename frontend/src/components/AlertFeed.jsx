export default function AlertFeed({ alerts }) {
  return (
    <aside className="alert-feed">
      <h2>Geofence events</h2>
      {alerts.length === 0 && (
        <p className="empty">No breaches yet. Draw a fence or wait for a vehicle to cross one.</p>
      )}
      <ul>
        {alerts.map((a, i) => (
          <li key={i} className={a.type === "ENTER" ? "enter" : "exit"}>
            <span className="badge">{a.type}</span>
            <span className="who">Vehicle {a.vehicleId}</span>
            <span className="where">{a.fence}</span>
            <span className="when">{new Date(a.ts).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
