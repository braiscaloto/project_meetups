import React, { useState, useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  addComment,
  getComments,
  getEvent,
  getAttendees,
  addLike,
  getLikes,
  deleteLike,
  addAttendee
} from "../http/eventsService";
import { useAuth } from "../context/auth-context";
import { Event } from "../components/Event";

function eventReducer(state, action) {
  switch (action.type) {
    case "GET_EVENT_SUCCESS":
      return {
        ...state,
        event: action.initialEvents
      };
    case "GET_LIKES_EVENTS":
      return {
        ...state,
        likes: action.initialLikes.length
      };
    case "GET_ATTENDEES_EVENTS":
      return {
        ...state,
        attendees: action.initialAttendees
      };
    case "GET_COMMENTS_EVENTS":
      return {
        ...state,
        comments: action.initialComments
      };
    case "CREATE_COMMENT":
      return { ...state, comments: { ...state.comment, ...action.comments } };
    case "CREATE_ATTENDEE":
      return { ...state, attendee: { ...state.attendee, ...action.attendees } };
    case "CREATE_LIKE":
      return { ...state, likes: { ...state.like, ...action.likes } };

    case "DELETE_LIKE":
      return {
        ...state,
        likes: { ...state }
      };
    default:
      return state;
  }
}

export function GetEvent() {
  const { register, errors, formState, handleSubmit } = useForm({
    mode: "onBlur"
  });
  const { currentUser } = useAuth();
  const history = useHistory();

  const [state, dispatch] = useReducer(eventReducer, {
    attendees: [],
    comments: [],
    event: [],
    likes: []
  });

  const urlParts = window.location.href.split("/");
  const eventId = urlParts[4];

  useEffect(() => {
    getEvent(eventId).then(response =>
      dispatch({
        type: "GET_EVENT_SUCCESS",
        initialEvents: response.data
      })
    );
    getLikes(eventId).then(response => {
      console.log(response);
      dispatch({
        type: "GET_LIKES_EVENTS",
        initialLikes: response.data
      });
    });
    getAttendees(eventId).then(response =>
      dispatch({
        type: "GET_ATTENDEES_EVENTS",
        initialAttendees: response.data
      })
    );
    getComments(eventId).then(response => {
      console.log(response);
      dispatch({
        type: "GET_COMMENTS_EVENTS",
        initialComments: response.data
      });
    });
  }, []);

  const handleCreateComment = formData => {
    const dataComment = {
      comment: formData.comment
    };

    addComment(eventId, dataComment).then(response => {
      dispatch({ type: "CREATE_COMMENT", comment: dataComment });
      history.push(`/events/${eventId}`);
    });
  };
  const handleCreateLike = data => {
    const dataLike = {
      ...data
    };

    addLike(eventId, dataLike).then(response => {
      console.log(response);
      dispatch({ type: "CREATE_LIKE", like: dataLike });
      history.push(`/events/${eventId}`);
    });
  };

  const handleCreateAttendee = data => {
    const dataAttendee = {
      ...data
    };
    addAttendee(eventId, data).then(response => {
      dispatch({ type: "CREATE_ATTENDEE", attendee: dataAttendee });
      history.push(`/events/${eventId}`);
    });
  };

  const handleDeleteLike = data => {
    const dataLike = {
      ...data
    };

    deleteLike(eventId, dataLike).then(response => {
      console.log(response);
      dispatch({ type: "DELETE_LIKE", currentUser });
      history.push(`/events/${eventId}`);
    });
  };

  return (
    <React.Fragment>
      <Event
        defaultEvent={state.event}
        defaultAttendees={state.attendees}
        defaultLikes={state.likes}
        defaultComments={state.comments}
      />
      <button
        className="btn-like"
        onClick={() => {
          handleCreateLike();
        }}
        onDoubleClick={() => {
          handleDeleteLike(currentUser);
        }}
      >
        ❤️ {state.likes}
      </button>
      <form onSubmit={handleSubmit(handleCreateComment)} noValidate>
        <div
          className={`form-control ${
            errors.name ? "ko" : formState.touched.name && "ok"
          }`}
        >
          <label>Comment</label>
          <input
            ref={register({
              required: "The content is mandatory"
            })}
            id="comment"
            name="comment"
            type="text"
            placeholder="Please enter your comment"
          ></input>
          {errors.title && (
            <span className="errorMessage">{errors.title.message}</span>
          )}
        </div>

        <div className="btn-container">
          <button
            type="submit"
            className="btn"
            disabled={formState.isSubmitting}
          >
            COMMENT
          </button>
        </div>
      </form>

      <button
        className="btn"
        onClick={() => {
          handleCreateAttendee(currentUser);
        }}
      >
        subscribe this event!!!
      </button>
    </React.Fragment>
  );
}
