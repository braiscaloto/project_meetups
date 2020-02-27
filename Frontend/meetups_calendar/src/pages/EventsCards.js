import React, { useEffect, useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getEvents } from "../http/eventsService";
import { useAuth } from "../context/auth-context";
import { EventList } from "../components/EventList";

function eventsReducer(state, action) {
  switch (action.type) {
    case "GET_EVENTS_SUCCESS":
      return { ...state, events: action.initialEvents };
    case "SELECT_EVENT":
      return { ...state, selectedEvent: action.index };
    default:
      return state;
  }
}

export function EventsCards() {
  const { handleSubmit, register, errors, formState } = useForm({
    mode: "onBlur"
  });
  const { currentUser, setCurrentUser, setIsAuthenticated } = useAuth();
  const history = useHistory();
  const [state, dispatch] = useReducer(eventsReducer, {
    events: [],
    selectedEvent: null
  });

  useEffect(() => {
    getEvents().then(response =>
      dispatch({
        type: "GET_EVENTS_SUCCESS",
        initialEvents: response.data
      })
    );
  }, []);

  return (
    <div className="App">
      <EventList events={state.evenst} />
      {/* <div className="container-card">
        <div className="card">
          <h3 className="title-card">Card 1</h3>
          <div className="event">
            <textarea
              
            />
          </div>
          <div className="bar">
            <div className="emptybar"></div>
            <div className="filledbar"></div>
          </div>
        </div> */}
      {/* <div className="card">
          <h3 className="title">Card 2</h3>
          <div className="bar">
            <div className="emptybar"></div>
            <div className="filledbar"></div>
          </div>
        </div>
        <div className="card">
          <h3 className="title">Card 3</h3>
          <div className="bar">
            <div className="emptybar"></div>
            <div className="filledbar"></div>
          </div>
        </div>
        <div className="card">
          <h3 className="title">Card 4</h3>
          <div className="bar">
            <div className="emptybar"></div>
            <div className="filledbar"></div>
          </div>
        </div>
        <div className="card">
          <h3 className="title">Card 5</h3>
          <div className="bar">
            <div className="emptybar"></div>
            <div className="filledbar"></div>
          </div>
        </div>
        <div className="card">
          <h3 className="title">Card 6</h3>
          <div className="bar">
            <div className="emptybar"></div>
            <div className="filledbar"></div>
          </div>
        </div>
        <div className="card">
          <h3 className="title">Card 7</h3>
          <div className="bar">
            <div className="emptybar"></div>
            <div className="filledbar"></div>
          </div>
        </div> 
      </div>*/}
    </div>
  );
}
