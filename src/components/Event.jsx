import React from "react";

export default function Event({ event, onEdit, onRemove, onView }) {
  return (
    <div
      className="calendar-event"
      style={{ background: event.color, color: "#fff", borderRadius: "4px", marginBottom: "4px", padding: "4px 8px", fontSize: "0.95em", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
      onClick={onView}
    >
      <img src="https://i.pravatar.cc/24" alt="avatar" style={{ borderRadius: "50%", marginRight: 8 }} />
      <div>
        <span className="event-title">{event.title}</span>
        <span className="event-time" style={{ marginLeft: 6, color: "#f3f3f3" }}>
          {event.startTime} - {event.endTime}
        </span>
      </div>
    </div>
  );
}