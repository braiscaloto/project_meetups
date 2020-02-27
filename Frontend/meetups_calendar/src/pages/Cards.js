// import React, { useEffect, useReducer } from "react";
// import { EventsCards } from "../components/EventsCards";
// import { getAllEvents } from "../http/eventsService";
// import { useHistory, Link } from "react-router-dom";

// function formatDate(date) {
//   var d = new Date(date),
//     month = "" + (d.getMonth() + 1),
//     day = "" + d.getDate(),
//     year = d.getFullYear();

//   if (month.length < 2) month = "0" + month;
//   if (day.length < 2) day = "0" + day;

//   return [year, month, day].join("-");
// }

// function eventsReducer(state, action) {
//   switch (action.type) {
//     case "GET_EVENTS_SUCCESS":
//       return {
//         ...state,
//         events: action.initialEvents.map(n => ({
//           title: n.title,
//           tag: n.tag,
//           date: formatDate(n.event_at)
//         }))
//       };
//     case "SELECT_EVENT":
//       return { ...state, selectedEvent: action.index };
//     default:
//       return state;
//   }
// }

// export function Cards() {
//   const [state, dispatch] = useReducer(eventsReducer, {
//     events: [],
//     selectedTag: null,
//     selectedEvent: null
//   });

//   const history = useHistory();
//   useEffect(() => {
//     getAllEvents().then(response =>
//       dispatch({
//         type: "GET_EVENTS_SUCCESS",
//         initialEvents: response.data.data
//       })
//     );
//   }, []);

//   return (
//     <React.Fragment>
//       {state.events.length > 0 && <EventsCards defaultEvents={state.events} />}
//     </React.Fragment>
//   );
// }
