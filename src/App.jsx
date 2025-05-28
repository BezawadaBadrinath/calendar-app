import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import WeeklyCalendar from "./components/WeeklyCalendar";
import TimelineView from "./components/TimelineView";
import Navigation from "./components/Navigation";
import "./styles/calendar.css";

function App() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null); // Track index of event being edited
  const [selectedEvent, setSelectedEvent] = useState(null); // For viewing event details
  const [view, setView] = useState("monthly");

  // Form state
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    color: "#2563eb",
    title: ""
  });

  // Load events from localStorage or fallback to JSON
  useEffect(() => {
    const saved = localStorage.getItem("events");
    console.log("Loaded from localStorage:", saved);
    if (!saved || saved === "[]" || saved === "") {
      // Only on first load, pull from events.json and save to localStorage
      fetch(process.env.PUBLIC_URL + "/data/events.json")
        .then(res => res.json())
        .then(data => {
          // Give each event a unique id
          const withIds = data.map(ev => ({
            ...ev,
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random()
          }));
          setEvents(withIds);
          localStorage.setItem("events", JSON.stringify(withIds));
        });
    } else {
      // Always load from localStorage after first load
      setEvents(JSON.parse(saved));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const handleToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  // Handle form changes
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add event to state
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime || !form.title) return;
    if (editIdx !== null) {
      // Edit mode: keep the same id
      setEvents(events.map((ev, i) => (i === editIdx ? { ...form, id: events[editIdx].id } : ev)));
      setEditIdx(null);
    } else {
      // Add mode: assign a new id
      setEvents([...events, { ...form, id: Date.now() + Math.random() }]);
    }
    setForm({
      date: "",
      startTime: "",
      endTime: "",
      color: "#2563eb",
      title: ""
    });
    setShowForm(false); // Close modal after adding
  };

  // Remove event
  const handleRemoveEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
    setSelectedEvent(null);
  };

  // Edit event: open modal with event data
  const handleEditEvent = (id) => {
    const idx = events.findIndex(ev => ev.id === id);
    setEditIdx(idx);
    setForm(events[idx]);
    setShowForm(true);
  };

  return (
    <>
      <div className="top-bar">
        {/* Logo, search, user avatar here */}
        {/* Example: */}
        <div className="top-bar-left">
          <span className="app-logo">CRMHUB</span>
          <input className="search-input" type="text" placeholder="Search" />
        </div>
        <div className="top-bar-right">
          <img className="user-avatar" src="https://i.pravatar.cc/32" alt="User" />
        </div>
      </div>
      <div className="app-container">
        <div className="sidebar">
          <div>
            <div className="logo">CRMHUB</div>
            <nav className="nav">
              <a href="#" className="nav-link"><span>🏠</span> Dashboard</a>
              <a href="#" className="nav-link"><span>👤</span> Accounts</a>
              <a href="#" className="nav-link"><span>📇</span> Contacts</a>
              <a href="#" className="nav-link"><span>🧑‍💼</span> Leads</a>
              <a href="#" className="nav-link active"><span>📅</span> Calendar</a>
              <a href="#" className="nav-link"><span>📂</span> Cases</a>
              <a href="#" className="nav-link"><span>⚡</span> Activities</a>
              <a href="#" className="nav-link"><span>👥</span> Users</a>
            </nav>
          </div>
          <div className="user">
            <img className="user-avatar" src="https://i.pravatar.cc/38" alt="User" />
            <div className="user-info">
              <div style={{ fontWeight: 600 }}>Uziel Renta</div>
              <div style={{ fontSize: "0.9em", color: "#888" }}>Admin</div>
            </div>
          </div>
        </div>
        <div className="main-content">
          <div className="calendar-header-main">Calendar</div>
          <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 2 }}>Full Event Schedule</div>
          <div style={{ color: "#888", fontSize: "0.95rem", marginBottom: "1.2rem" }}>{new Date().toLocaleDateString()}</div>
          <div className="calendar-view-switch">
            <button className={`view-btn${view === "monthly" ? " active" : ""}`} onClick={() => setView("monthly")}>Monthly</button>
            <button className={`view-btn${view === "weekly" ? " active" : ""}`} onClick={() => setView("weekly")}>Weekly</button>
            <button className={`view-btn${view === "timeline" ? " active" : ""}`} onClick={() => setView("timeline")}>Timeline</button>
          </div>
          <div className="calendar-controls">
            <div>
              <Navigation
                month={month}
                year={year}
                onPrev={handlePrev}
                onNext={handleNext}
              />
              <button className="today-btn" onClick={handleToday}>Today</button>
            </div>
            <div>
              <button
                style={{ marginBottom: "1rem", padding: "0.4rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }}
                onClick={() => setShowForm(true)}
              >
                Add Event
              </button>
              <button
                style={{ marginLeft: "1rem", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4, padding: "0.4rem 1rem" }}
                onClick={() => {
                  localStorage.removeItem("events");
                  window.location.reload();
                }}
              >
                Reset Calendar
              </button>
            </div>
          </div>
          {view === "monthly" && (
            <Calendar
              month={month}
              year={year}
              events={events}
              onEditEvent={handleEditEvent}
              onRemoveEvent={handleRemoveEvent}
              onViewEvent={setSelectedEvent}
            />
          )}
          {view === "weekly" && (
            <WeeklyCalendar
              month={month}
              year={year}
              events={events}
              onEditEvent={handleEditEvent}
              onRemoveEvent={handleRemoveEvent}
              onViewEvent={setSelectedEvent}
            />
          )}
          {view === "timeline" && (
            <TimelineView
              events={events}
              onEditEvent={handleEditEvent}
              onRemoveEvent={handleRemoveEvent}
              onViewEvent={setSelectedEvent}
            />
          )}

          {/* Modal for Add Event */}
          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setShowForm(false)} title="Close">&times;</button>
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
                  {editIdx !== null ? "Edit Event" : "Add Event"}
                </h3>
                <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  <input type="date" name="date" value={form.date} onChange={handleFormChange} required />
                  <input type="time" name="startTime" value={form.startTime} onChange={handleFormChange} required />
                  <input type="time" name="endTime" value={form.endTime} onChange={handleFormChange} required />
                  <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="Event Title" required />
                  <input type="color" name="color" value={form.color} onChange={handleFormChange} style={{ width: 32, height: 32, border: "none" }} />
                  <button type="submit" style={{ padding: "0.4rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }}>Add Event</button>
                </form>
              </div>
            </div>
          )}

          {/* Modal for Viewing Event Details */}
          {selectedEvent && (
            <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setSelectedEvent(null)} title="Close">&times;</button>
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>{selectedEvent.title}</h3>
                <div><b>Date:</b> {selectedEvent.date}</div>
                <div><b>Time:</b> {selectedEvent.startTime} - {selectedEvent.endTime}</div>
                <div><b>Color:</b> <span style={{ background: selectedEvent.color, padding: "0 10px", borderRadius: 3 }}>{selectedEvent.color}</span></div>
                <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{ padding: "0.4rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }}
                    onClick={() => {
                      const idx = events.findIndex(ev => ev.id === selectedEvent.id);
                      setForm(events[idx]);
                      setEditIdx(idx);
                      setShowForm(true);
                      setSelectedEvent(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{ padding: "0.4rem 1rem", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4 }}
                    onClick={() => {
                      handleRemoveEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

