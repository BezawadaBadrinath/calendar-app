import React from "react";
import { getMonthDays, isToday, formatDate, isCurrentMonth } from "../utils/dateUtils";
import Event from "./Event";

export default function Calendar({ month, year, events, onEditEvent, onRemoveEvent, onViewEvent }) {
  const days = getMonthDays(month, year);

  // Group events by date for quick lookup
  const eventsByDate = {};
  events.forEach((event, idx) => {
    if (!eventsByDate[event.date]) eventsByDate[event.date] = [];
    eventsByDate[event.date].push({ ...event, _idx: idx });
  });

  // Split days into weeks for grid rows
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="calendar-grid">
      <div className="calendar-row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="calendar-header-cell">{d}</div>
        ))}
      </div>
      {weeks.map((week, wIdx) => (
        <div className="calendar-row" key={wIdx}>
          {week.map((date, idx) => {
            const dateStr = formatDate(date);
            const cellEvents = (eventsByDate[dateStr] || []).slice().sort(
              (a, b) => a.startTime.localeCompare(b.startTime)
            );
            return (
              <div
                key={idx}
                className={
                  "calendar-cell" +
                  (isToday(date) ? " today" : "") +
                  (!isCurrentMonth(date, month, year) ? " other-month" : "")
                }
              >
                <div className="calendar-date">{date.getDate()}</div>
                <div className="calendar-events">
                  {cellEvents.map((event, i) => (
                    <Event
                      key={event.id}
                      event={event}
                      onEdit={() => onEditEvent(event.id)}
                      onRemove={() => onRemoveEvent(event.id)}
                      onView={() => onViewEvent(event)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function WeeklyCalendar({ month, year, events, ...props }) {
  return <div style={{ padding: 32, textAlign: "center" }}>Weekly view coming soon!</div>;
}