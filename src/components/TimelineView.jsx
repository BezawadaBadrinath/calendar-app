import React from "react";

export default function TimelineView({ events, ...props }) {
  const sorted = [...events].sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  return (
    <div style={{ padding: 32 }}>
      <h3>Timeline</h3>
      <ul>
        {sorted.map(ev => (
          <li key={ev.id}>
            <b>{ev.title}</b> — {ev.date} {ev.startTime}-{ev.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
}