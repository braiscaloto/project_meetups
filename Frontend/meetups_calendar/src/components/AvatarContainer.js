import React, { useState, useEffect } from 'react';

import { getProfile } from '../http/userService';

import { useHistory } from 'react-router-dom';

export function AvatarContainer({ id }) {
  const [profile, setProfile] = useState({});
  const history = useHistory();
  useEffect(() => {
    getProfile(id).then(response => setProfile(response.data[0]));
  }, []);

  const hasProfile = Object.keys(profile).length > 0;
  if (!hasProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div
      onClick={() => history.push(`/profile/${id}`)}
      className='AvatarContainer'
    >
      <div className='titleProfile'>
        <h2>{profile.name}</h2>
      </div>
      <div>
        {profile.avatar_url === null && (
          <img
            className='avatarProfile'
            src={require('../images/default-avatar.png')}
          />
        )}
      </div>
      <div className='avatarContainer'>
        {profile.avatar_url !== null && (
          <img className='avatarProfile' src={profile.avatar_url} />
        )}
      </div>
    </div>
  );
}
