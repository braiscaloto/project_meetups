import React from "react";
import myVideo from "../video/loopweb.mp4";
import { Link } from "react-router-dom";

export function Headboard() {
  return (
    <React.Fragment>
      <video autoPlay loop muted>
        <source src={myVideo} type="video/mp4"></source>
      </video>
      <header className="viewport-header">
        <h1>
          <span>meetech</span>
        </h1>
      </header>
      <main>
        <article className="">
          <Link className="btn" to={`/log in`}>
            Sing In
          </Link>
          <Link className="btn" to={`/register`}>
            Sing Up
          </Link>
        </article>
      </main>
    </React.Fragment>
  );
}
