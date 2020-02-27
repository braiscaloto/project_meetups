import React, { useEffect, useReducer } from "react";
import { useHistory, Link } from "react-router-dom";
import { getEvents, updateEvent, deleteEvent } from "../http/eventsService";
import { useMatchMedia } from "../hooks/useMatchMedia";
import { Header } from "../components/Header";
import { useAuth } from "../context/auth-context";
import { EventList } from "../components/EventList";
import { Event } from "../components/Event";
import { Charts } from "../components/Charts";

function eventsReducer(state, action) {
  switch (action.type) {
    case "GET_EVENTS_SUCCESS":
      return {
        ...state,
        events: action.initialEvents
      };
    case "SAVE_EVENT":
      return {
        ...state,
        events: state.events.map(n => {
          if (n.id === action.event.id) {
            return action.event;
          }
          return n;
        })
      };
    case "DELETE_EVENT":
      return { ...state, events: state.events.filter(n => n.id !== action.id) };
    case "SELECT_EVENT":
      return { ...state, selectedEvent: action.index };
    case "SEARCH_TEXT_CHANGED":
      return { ...state, searchText: action.text };
    case "TOGGLE_EVENT":
      return {
        ...state,
        isEventOpened: !state.isEventOpened,
        isMenuOpened: false
      };
    case "TOGGLE_MENU":
      return {
        ...state,
        isMenuOpened: !state.isMenuOpened,
        isEventOpened: false
      };
    default:
      return state;
  }
}

export function Dashboard() {
  const isMobile = useMatchMedia("(max-width:576px)");
  const history = useHistory();
  const { currentUser } = useAuth();

  const [state, dispatch] = useReducer(eventsReducer, {
    events: [],
    selectedTag: null,
    selectedEvent: null,
    isMenuOpened: false,
    isEventOpened: false,
    searchText: ""
  });

  useEffect(() => {
    getEvents().then(response =>
      dispatch({
        type: "GET_EVENTS_SUCCESS",
        initialEvents: response.data.data
      })
    );
  }, []);

  const filteredEvents = state.events.filter(event => {
    const text = `${event.title} ${event.content}`.trim();
    const filterText = text
      .toLowerCase()
      .includes(state.searchText.toLowerCase());

    return filterText;
  });

  const handleSaveEvent = event => {
    updateEvent(event).then(response => {
      dispatch({ type: "SAVE_EVENT", event: response.data });
    });
  };

  const handleDeleteEvent = id => {
    deleteEvent(id).then(() => {
      dispatch({ type: "DELETE_EVENT", id });
    });
  };
  if (state.events.length === 0) return null;
  const eventId = state.events[0].id;
  return (
    <React.Fragment>
      <Header
        title=""
        user={currentUser.user}
        onMenuOpenedChange={() => dispatch({ type: "TOGGLE_MENU" })}
        onLogout={e => {
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
        }}
      />
      <nav>
        <Link className="btn" to="/profile">
          Profile
        </Link>
        <Link className="btn" to="/">
          Calendar
        </Link>
      </nav>
      <main id="dashboard">
        <div
          className={`grid ${state.isMenuOpened &&
            "menu-opened"} ${state.isEventOpened && "events-opened"}`}
        >
          <div className="event-list">
            <EventList
              events={filteredEvents}
              selectedIndex={state.selectedEvent}
              onSelectEvent={index => {
                dispatch({ type: "SELECT_EVENT", index });
                dispatch({ type: "TOGGLE_EVENT" });
              }}
            />
          </div>
          {state.selectedEvent === null && (
            <h3 className="no-event-selected"></h3>
          )}
          {/* {state.selectedEvent !== null && (
            <Event
              defaultEvent={filteredEvents[state.selectedEvent]}
              onSaveEvent={event => handleSaveEvent(event)}
              onDeleteEvent={id => handleDeleteEvent(id)}
            />
          )} */}
          {state.selectedEvent !== null && <Charts />}
        </div>

        {isMobile && state.selectedEvent !== null && (
          <button
            onClick={() => {
              dispatch({ type: "TOGGLE_EVENT" });
              dispatch({ type: "SELECT_EVENT", index: null });
            }}
            className="icon-button add-event-mobile"
            style={{ position: "fixed", bottom: "20px", left: "20px" }}
          />
        )}
      </main>
    </React.Fragment>
  );
}
