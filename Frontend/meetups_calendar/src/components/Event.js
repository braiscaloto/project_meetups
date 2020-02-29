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

        <h2>Comments...</h2>
        {defaultComments.map(comment => {
          return (
            <li key={comment.id}>
              <p id="content">{comment.comment}</p>
            </li>
          );
        })}
      </div>
    </main>
  );
}
