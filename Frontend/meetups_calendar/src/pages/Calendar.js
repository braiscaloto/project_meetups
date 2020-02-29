import React, { useEffect, useReducer } from "react";

import { getAllEvents } from "../http/eventsService";
import { EventsCalendar } from "../components/EventsCalendar";
import { useHistory, Link } from "react-router-dom";

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function eventsReducer(state, action) {
  switch (action.type) {
    case "GET_EVENTS_SUCCESS":
      return {
        ...state,
        events: action.initialEvents.map(n => ({
          title: n.title,
          date: formatDate(n.event_at)
        }))
      };
    case "SELECT_EVENT":
      return { ...state, selectedEvent: action.index };
    default:
      return state;
  }
}

export function Calendar() {
  const [state, dispatch] = useReducer(eventsReducer, {
    events: [],
    selectedTag: null,
    selectedEvent: null
  });

  const history = useHistory();
  useEffect(() => {
    getAllEvents().then(response =>
      dispatch({
        type: "GET_EVENTS_SUCCESS",
        initialEvents: response.data.data
      })
    );
  }, []);

  return (
    <React.Fragment>
      <header>
        <article className="header-calendar1">
          <Link id="meetech" to="/">
            <h1 className="logo-calendar">meetech</h1>
          </Link>
        </article>
        <div className="header-calendar2">
          <Link to="/register" className="btn">
            Sign Up
          </Link>
          <Link to="/login" className="btn">
            Sign In
          </Link>
        </div>
      </header>
      <main>
        <article>
          {state.events.length > 0 && (
            <EventsCalendar defaultEvents={state.events} />
          )}
        </article>
      </main>
    </React.Fragment>
  );
}
