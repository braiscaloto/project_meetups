import React, { useState, useRef } from 'react';
import { updateAvatar } from '../http/userService';
import { useAuth } from '../context/auth-context';

export default function FileUpload() {
  const [file, setFile] = useState();
  const fileInput = useRef();
  const { currentUser } = useAuth();

  const handleChange = e => {
    setFile(e.target.files);
  };

  const handleUpload = () => {
    if (!file) {
      return;
    }

    const data = new FormData();
    data.append('avatar', file[0]);

    updateAvatar(data).then(response => {
      /*return {
        avatarUrl: response.headers.location
      };*/
    });
  };

  return (
    <nav>
      <form className='uploadAvatarForm'>
        <h2 className='titleAvatar'>Change your avatar</h2>
        <input
          ref={fileInput}
          className='uploadForm'
          type='file'
          onChange={handleChange}
        />

        <button className='button-upload' type='button' onClick={handleUpload}>
          Upload
        </button>
        <h3 className='restartTitle'>Restart session to apply changes</h3>
      </form>
    </nav>
  );
}
