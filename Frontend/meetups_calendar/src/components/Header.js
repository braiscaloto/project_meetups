import React, { useReducer } from 'react';
import { useMatchMedia } from '../hooks/useMatchMedia';
import { MiniAvatarContainer } from '../components/MiniAvatarContainer';
import { Link } from 'react-router-dom';

export function Header({ title, user, onMenuOpenedChange, onLogout }) {
  const isMobile = useMatchMedia('(max-width:576px)');
  //Aquí hice cambios en el Link salir, para que haga logout y te lleve al calendar publico
  return (
    <header className='header'>
      {!isMobile && <p className='header-name'>{user}</p>}
      <Link
        className='btn-header'
        href='/'
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
      >
        Salir
      </Link>
      <MiniAvatarContainer />
    </header>
  );
}

function NavLink() {
  return (
    <a href='#tags' id='tags-toggle'>
      <svg
        width='16'
        height='13'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          stroke='#C86818'
          stroke-width='3'
          d='M0 1.5h16M0 6.5h16M0 11.5h16'
        />
      </svg>
    </a>
  );
}
