import React from "react";
import { useHistory, Link } from "react-router-dom";

export function EventList({
  events,
  selectedIndex,
  onSelectEvent,
  onSelectDate
}) {
  console.log(onSelectDate);

  return (
    <div className="opacity-container ">
      <ul className="m-t-lg">
        {events.map((event, index) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`} className="link">
              View more..
            </Link>
            <div
              onClick={() => onSelectEvent(index)}
              className={`event-item ${selectedIndex === index && "selected"}`}
            >
              <div className="container">
                <div style={{ minWidth: "35px" }}>
                  <span className="date">{onSelectDate}</span>
                </div>

                <div className="overflow-hidden">
                  <h5 className="truncate-text title">
                    {event.title || "Untitled Event"}
                  </h5>
                  <p className="truncate-multiline-text description">
                    {event.content || "No content"}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
