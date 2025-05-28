import React from "react";

export default function Navigation({ month, year, onPrev, onNext }) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return (
    <div className="calendar-nav">
      <button onClick={onPrev}>&lt;</button>
      <span>{monthNames[month]} {year}</span>
      <button onClick={onNext}>&gt;</button>
    </div>
  );
}