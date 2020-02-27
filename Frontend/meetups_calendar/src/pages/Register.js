import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { signUp } from '../http/authService';
import { useAuth } from '../context/auth-context';

export function Register() {
  const { register, errors, formState, handleSubmit } = useForm({
    mode: 'onBlur'
  });
  const { setIsAuthenticated, setCurrentUser } = useAuth();
  const history = useHistory();

  const handleRegister = formData => {
    return signUp(formData)
      .then(response => {
        setIsAuthenticated(false);
        setCurrentUser(response.data);
        history.push('/login');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <main className='centered-container'>
      <h3>Create your acount</h3>
      <form onSubmit={handleSubmit(handleRegister)} noValidate>
        <div
          className={`form-control ${
            errors.name ? 'ko' : formState.touched.name && 'ok'
          }`}
        >
          <label>Name</label>
          <input
            ref={register({
              required: 'The name is mandatory'
            })}
            name='name'
            type='text'
            placeholder='Please enter your name'
          ></input>
          {errors.name && (
            <span className='errorMessage'>{errors.name.message}</span>
          )}
        </div>
        <div
          className={`form-control ${
            errors.email ? 'ko' : formState.touched.email && 'ok'
          }`}
        >
          <label>Email</label>
          <input
            ref={register({
              required: 'The email is mandatory',
              pattern: {
                message: 'The email is not valid',
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              }
            })}
            name='email'
            type='email'
            placeholder='Please enter your email'
          ></input>
          {errors.email && (
            <span className='errorMessage'>{errors.email.message}</span>
          )}
        </div>
        <div
          className={`form-control ${
            errors.password ? 'ko' : formState.touched.password && 'ok'
          }`}
        >
          <label>Password</label>
          <input
            ref={register({
              required: 'The password is mandatory',
              minLength: {
                message: 'Password length should be greater than 6',
                value: 6
              }
            })}
            name='password'
            type='password'
            placeholder='Please enter your password'
          ></input>
          {errors.password && (
            <span className='errorMessage'>{errors.password.message}</span>
          )}
        </div>
        <div className='btn-container'>
          <button
            type='submit'
            className='btn'
            disabled={formState.isSubmitting}
          >
            Register
          </button>
          <div className='m-t-lg'>
            <Link to='/login'>Already have an account, please sign in</Link>
          </div>
        </div>
      </form>
    </main>
  );
}
