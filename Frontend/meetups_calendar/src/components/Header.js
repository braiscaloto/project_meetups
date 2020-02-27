import React, { useReducer } from "react";
import { useMatchMedia } from "../hooks/useMatchMedia";

export function Header({ title, user, onMenuOpenedChange, onLogout }) {
  const isMobile = useMatchMedia("(max-width:576px)");
  return (
    <header className="header">
      {!isMobile && <h1>{title}</h1>}
      {isMobile && (
        <div className="header-item" onClick={onMenuOpenedChange}>
          <NavLink />
        </div>
      )}

      <div className="header-item right">
        <div>
          {!isMobile && <p className="header-name">Hola {user}</p>}
          <a href="/" onClick={onLogout}>
            Salir
          </a>
        </div>
      </div>
    </header>
  );
}

function NavLink() {
  return (
    <a href="#tags" id="tags-toggle">
      <svg
        width="16"
        height="13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="#C86818"
          stroke-width="3"
          d="M0 1.5h16M0 6.5h16M0 11.5h16"
        />
      </svg>
    </a>
  );
}
