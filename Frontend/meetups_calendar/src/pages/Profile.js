import React from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('currentUser'));

  const user = jwt_decode(storedUser);

  return (
    <React.Fragment>
      <main className='profile'>
        <Link className='btn' to={`/`}>
          GO CALENDAR
        </Link>
        <h1 className='titleProfile'>{user.name}</h1>

        <div className='avatarContainer'>
          <img className='avatarProfile' src={user.avatar_url} />
        </div>
        <Link className='btn' to={`/update/${user.userId}`}>
          Update Profile
        </Link>
        <div className='contactProfile'>
          <p className='emailProfile'>Contact me: {user.email}</p>
        </div>

        <Link className='btn' to='/'>
          <button
            className='logoutButton'
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            LOGOUT
          </button>
        </Link>
      </main>
    </React.Fragment>
  );
}
