import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signIn } from "../http/authService";
import { useAuth } from "../context/auth-context";

export function Login() {
  const {
    handleSubmit,
    register,
    errors,
    formState,
    setError,
    setValue
  } = useForm({
    mode: "onBlur"
  });
  const history = useHistory();
  const { setIsAuthenticated, setCurrentUser } = useAuth();

  const handleLogin = formData => {
    return signIn(formData)
      .then(response => {
        setIsAuthenticated(true);
        setCurrentUser(response.data);

        history.push(`/CalendarPrivate`);
      })
      .catch(error => {
        setValue("password", "");
        setError("password", "credentials", "The credentials are invalid");
      });
  };

  return (
    <React.Fragment>
      <Link className="linkHome" to={"/"}>
        access without signin
      </Link>
      <main className="centered-container">
        <h3>SIGN IN TO MEETECH</h3>

        <form onSubmit={handleSubmit(handleLogin)} noValidate>
          <div
            className={`form-control ${
              errors.email ? "ko" : formState.touched.email && "ok"
            }`}
          >
            <label>Email</label>
            <input
              ref={register({
                required: "The email is mandatory",
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "The email is not valid"
                }
              })}
              name="email"
              type="email"
              placeholder="Please enter your email"
            ></input>
            {errors.email && (
              <span className="errorMessage">{errors.email.message}</span>
            )}
          </div>
          <div
            className={`form-control ${
              errors.password ? "ko" : formState.touched.password && "ok"
            }`}
          >
            <label>Password</label>
            <input
              ref={register({
                required: "The password is mandatory",
                minLength: {
                  value: 6,
                  message:
                    "You should enter a password with at least 6 characters"
                }
              })}
              name="password"
              type="password"
              placeholder="Please enter your password"
            ></input>
            {errors.password && (
              <span className="errorMessage">{errors.password.message}</span>
            )}
          </div>
          <div className="btn-container">
            <button
              type="submit"
              className="btn"
              disabled={formState.isSubmitting}
            >
              Login
            </button>

            <Link className="linkCreateAccount" to="/register">
              {" "}
              New to Meetech? Create an account
            </Link>
          </div>
        </form>
      </main>
    </React.Fragment>
  );
}
