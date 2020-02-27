import React, { useEffect, useReducer } from "react";

export function EventsCards({ defaultEvents = {} }) {
  return (
    <React.Fragment className="App">
      {defaultEvents.map(event => {
        return (
          <div key={event.id} className="container-card">
            <div className="card">
              <h3 className="title-card">{event.title}</h3>
              <div className="event">
                <textarea />
              </div>
              <div className="bar">
                <div className="emptybar"></div>
                <div className="filledbar"></div>
              </div>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}
