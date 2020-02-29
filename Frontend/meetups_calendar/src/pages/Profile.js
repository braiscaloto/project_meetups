import React from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

export function Profile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <React.Fragment>
      <main className="profile">
        <Link className="btn" to={`/CalendarPrivate`}>
          GO CALENDAR
        </Link>
        <h1 className="titleProfile">{user.name}</h1>

        <div className="avatarContainer">
          {user.avatarUrl !== null && (
            <img className="avatarProfile" src={user.avatarUrl} />
          )}
          {user.avatarUrl === null && (
            <img
              className="avatarProfile"
              src={require("../images/default-avatar.png")}
            />
          )}
        </div>
        <Link className="btn" to={`/update/${user.userId}`}>
          Update Profile
        </Link>
        <div className="contactProfile">
          <p className="emailProfile">Contact me: {user.email}</p>
        </div>

        <Link className="btn" to="/">
          <button
            className="logoutButton"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            LOGOUT
          </button>
        </Link>
      </main>
    </React.Fragment>
  );
}
