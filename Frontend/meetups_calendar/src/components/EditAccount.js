import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { updateAccount } from '../http/userService';
import { useHistory } from 'react-router';
//import { useAuth } from '../context/auth-context';
import FileUpload from '../components/FileUpload';

export default function EditAccount() {
  const { register, handleSubmit, setError } = useForm({
    mode: 'onBlur'
  });
  //const { setIsAuthenticated, setCurrentUser } = useAuth();
  const history = useHistory();

  const handleAccountChange = formData => {
    return (
      updateAccount(formData)
        /*.then(response => {
        setIsAuthenticated(true);
        setCurrentUser(response.data);
      })*/
        .then(history.push('/login'))
        .catch(error => {
          setError(error);
        })
    );
  };
  return (
    <React.Fragment>
      <main className='updateAccountMain'>
        <Link className='linkBack' to='/profile'>
          ← Go Back
        </Link>
        <FileUpload />

        <section className='form-edit-account'>
          <h3 className='titleEditAccount'>Edit Account</h3>
          <form
            onSubmit={handleSubmit(handleAccountChange)}
            className='editForm'
          >
            <div className='userUpdate'>
              <label>Current Password</label>
              <input
                type='password'
                name='password'
                ref={register({
                  required: 'The password is mandatory',
                  minLength: {
                    message: 'Password length should be greater than 6',
                    value: 6
                  }
                })}
              />
            </div>
            <div className='userUpdate'>
              <label>New Password</label>
              <input
                type='password'
                name='newPassword'
                ref={register({
                  required: 'The password is mandatory',
                  minLength: {
                    message: 'Password length should be greater than 6',
                    value: 6
                  }
                })}
              />
            </div>

            <div className='userUpdate'>
              <label>Name</label>
              <input
                type='name'
                name='name'
                ref={register({
                  required: 'The name is mandatory'
                })}
              />
            </div>
            <div className='userUpdate'>
              <button
                type='submit'
                className='updateButton'
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
              >
                Update Changes
              </button>
              <p className='pRestartSession'>
                Your session will be need restarted to apply changes
              </p>
            </div>
          </form>
        </section>
        <Link className='linkDelete' to='/delete'>
          Delete your account
        </Link>
      </main>
    </React.Fragment>
  );
}
