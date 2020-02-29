import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { getProfile } from '../http/userService';

export function MiniAvatarContainer({ id }) {
  const [profile, setProfile] = useState({});
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    getProfile(id).then(response => setProfile(response.data[0]));
  }, []);

  return (
    <main className='miniAvatar'>
      <div className='MiniAvatarContainer'>
        {profile.avatar_url === null && (
          <img
            className='headerAvatar'
            src={require('../images/default-avatar.png')}
          />
        )}
      </div>
      <div className='MiniAvatarContainer'>
        {profile.avatar_url !== null && (
          <img
            className='headerAvatar'
            src={user.avatarUrl}
            onClick={() => {
              history.push('/profile');
            }}
          />
        )}
      </div>
    </main>
  );
}
