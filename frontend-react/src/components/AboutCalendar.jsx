import { useEffect, useMemo, useState } from "react";
import "./AboutCalendar.css";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const events = [
  {
    day: 7,
    title: "Learn About Your Zoo",
    description:
      "Join our expert guides for an educational tour of the zoo. Learn about animal habitats, conservation efforts, and the important work we do to protect wildlife.",
    time: "10:00 AM - 11:30 AM",
  },
  {
    day: 15,
    title: "Feed the Animals",
    description:
      "Experience the joy of feeding our animals! Watch as zookeepers provide meals and learn about the dietary needs of different species. Perfect for families!",
    time: "2:00 PM - 3:00 PM",
  },
  {
    day: 20,
    title: "Learn About Your Zoo",
    description:
      "Join our expert guides for an educational tour of the zoo. Learn about animal habitats, conservation efforts, and the important work we do to protect wildlife.",
    time: "10:00 AM - 11:30 AM",
  },
];

export default function AboutCalendar() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedEvent ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedEvent]);

  const leadingEmptyCells = useMemo(
    () =>
      Array.from(
        { length: new Date(currentYear, currentMonth, 1).getDay() },
        (_, index) => index
      ),
    [currentMonth, currentYear]
  );

  const calendarDays = useMemo(() => {
    const days = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({ length: days }, (_, index) => index + 1);
  }, [currentMonth, currentYear]);

  function changeMonth(direction) {
    setCurrentMonth((prev) => {
      const next = prev + direction;
      if (next < 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      if (next > 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return next;
    });
  }

  function eventsForDay(day) {
    return events.filter((event) => event.day === day);
  }

  function isToday(day) {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  }

  function openEvent(day) {
    const event = eventsForDay(day)[0];
    if (!event) return;
    setSelectedEvent({ day, event });
  }

  return (
    <>
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <button className="calendar-nav" aria-label="Previous month" onClick={() => changeMonth(-1)}>
            ←
          </button>
          <h3 className="calendar-month-year">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button className="calendar-nav" aria-label="Next month" onClick={() => changeMonth(1)}>
            →
          </button>
        </div>

        <div className="calendar-day-labels">
          {dayNames.map((day) => (
            <div key={day} className="calendar-day-label">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {leadingEmptyCells.map((index) => (
            <div key={`empty-${index}`} className="calendar-day empty" />
          ))}
          {calendarDays.map((day) => (
            <div
              key={day}
              className={`calendar-day ${eventsForDay(day).length > 0 ? "has-events" : ""} ${
                isToday(day) ? "today" : ""
              }`}
              onClick={() => (eventsForDay(day).length > 0 ? openEvent(day) : null)}
            >
              <div className="calendar-day-number">{day}</div>
              {eventsForDay(day).length > 0 ? (
                <div className="calendar-events">
                  {eventsForDay(day).map((event) => (
                    <div key={`${day}-${event.title}`} className="calendar-event">
                      {event.title}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {selectedEvent ? (
        <div className="event-modal active" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="event-modal-header">
              <h3 className="event-modal-title">{selectedEvent.event.title}</h3>
              <button
                className="event-modal-close"
                aria-label="Close"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            <div className="event-modal-body">
              <p className="event-modal-date">
                {monthNames[currentMonth]} {selectedEvent.day}, {currentYear}
              </p>
              <p className="event-modal-time">Time: {selectedEvent.event.time}</p>
              <p className="event-modal-description">{selectedEvent.event.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
