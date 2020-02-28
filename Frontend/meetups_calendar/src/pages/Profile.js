import React from 'react';
import { Link } from 'react-router-dom';
import { AvatarContainer } from '../components/AvatarContainer';

export function Profile() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <React.Fragment>
      <main className='profile'>
        <Link className='btn' to={`/`}>
          GO CALENDAR
        </Link>

        <AvatarContainer id={user.userId} />

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
