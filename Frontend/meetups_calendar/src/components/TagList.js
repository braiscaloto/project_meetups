import React from "react";

export function TagList({ tags, selectedIndex, onTagSelected }) {
  return (
    <ul className="tag-list p-t-md">
      <li
        className={selectedIndex === null ? "selected" : ""}
        onClick={() => onTagSelected(null)}
      >
        <p className="tag-list-item">All events</p>
      </li>
      {tags.map((tag, index) => (
        <li
          key={tag}
          onClick={() => onTagSelected(index)}
          className={selectedIndex === index ? "selected" : ""}
        >
          <p className="tag-list-item">#{tag}</p>
        </li>
      ))}
    </ul>
  );
}
