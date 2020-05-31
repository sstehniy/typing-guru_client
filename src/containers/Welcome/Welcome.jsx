import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Welcome.scss";
import {
  Switch,
  Route,
  useLocation,
  useRouteMatch,
  useHistory,
  Redirect,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ThemeProvider } from "styled-components";
import Register from "../../components/Register/Register";
import Login from "../../components/Login/Login";
import RegisterSuccess from "../../components/RegisterSuccess/RegisterSuccess";

const colors = {
  green: "#449D8F",
  peach: "#BC7110",
  orange: "#B63827",
  black: "#242331",
  jet: "#353238",
  red: "#EF5B5B",
  yellow: "#fff05a",
  pink: "#FBDCE2",
  blue: "#4D9DE0",
  lightGreen: "#68A357",
};

const Welcome = () => {
  const location = useLocation();
  const match = useRouteMatch("/welcome");

  return (
    <div className="welcome__container">
      <TransitionGroup className="tansition-group">
        <CSSTransition
          key={location.key}
          timeout={{ enter: 600, exit: 300 }}
          classNames="switch"
        >
          <section className="route-section">
            <Switch location={location}>
              <Route path={`${match.path}/login`} exact component={Login} />
              <Route
                path={`${match.path}/register`}
                exact
                component={Register}
              />
              <Route
                path={`${match.path}/registration-success/:userId`}
                exact
                component={RegisterSuccess}
              />
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

const WelcomeWrapper = () =>
  createPortal(
    <ThemeProvider theme={{ colors }}>
      <Welcome />
    </ThemeProvider>,
    document.getElementById("welcome")
  );

export default WelcomeWrapper;
