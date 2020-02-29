import React, { useState, useEffect } from "react";
import { TagsInput } from "./TagsInput";
import { useHistory } from "react-router";

export function Event({
  defaultEvent = {},
  defaultAttendees = {},
  defaultLikes = {},
  defaultComments = {}
}) {
  const history = useHistory();

  console.log(defaultComments);

  return (
    <main>
      <div className="event">
        <h1 id="title" className="titleComment">
          {defaultEvent.title}
        </h1>
        <p id="event_time"></p>
        <p id="content" className="content">
          {defaultEvent.content}
        </p>

        <article>
          <h2>Comments...</h2>
          <ul>
            {defaultComments.map(comment => (
              <li key={comment.comment}>
                <p id="content">{comment.comment}</p>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <ul>
            {defaultAttendees.map(attendee => (
              <li key={attendee.id}>
                <h3 id="content">{attendee.name}</h3>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </main>
  );
}
