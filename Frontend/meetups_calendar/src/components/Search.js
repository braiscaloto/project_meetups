import React from "react";

export function Search({ searchText, onAddEvent, onSearchTextChanged }) {
  return (
    <div className="flex">
      <input
        className="search"
        type="search"
        value={searchText}
        onChange={e => onSearchTextChanged(e.target.value)}
      />
      {<button className="icon-button add-event" onClick={onAddEvent} />}
    </div>
  );
}
