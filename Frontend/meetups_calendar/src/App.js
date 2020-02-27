import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthProvider } from "./context/auth-context";
import { PrivateRoute } from "./components/PrivateRoute";
import { AddEvent } from "./pages/AddEvent";
import { Cards } from "./pages/Cards";
import { GetEvent } from "./pages/GetEvent";
import { Calendar } from "./pages/Calendar";
import { Profile } from "./pages/Profile";
import { UserUpdate } from "./pages/UserUpdate";
import { DeleteAccount } from "./pages/Delete";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route exact path="/">
            <Calendar />
          </Route>
          <PrivateRoute path="/home">
            <Dashboard />
          </PrivateRoute>
          <Route path="/cards">
            <Cards />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/events">
            <GetEvent />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/profile">
            <Profile />
          </PrivateRoute>
          <PrivateRoute path="/update">
            <UserUpdate />
          </PrivateRoute>
          <PrivateRoute path="/delete">
            <DeleteAccount />
          </PrivateRoute>
          <PrivateRoute path="/add-event">
            <AddEvent />
          </PrivateRoute>
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
