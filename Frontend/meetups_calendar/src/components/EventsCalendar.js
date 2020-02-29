import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export function EventsCalendar(defaultEvents = {}) {
  console.log(defaultEvents);

  return (
    <React.Fragment>
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        height="parent"
        navlinks="true"
        events={defaultEvents.defaultEvents}
      />
    </React.Fragment>
  );
}
