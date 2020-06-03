import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import styled from "styled-components";

import Home from "./containers/Home/Home";
import Welcome from "./containers/Welcome/Welcome";

const StyledApp = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: stretch;
  justify-content: center;
`;

function App() {
  const user = useSelector(({ user }) => user);
  const { data: userData, isLoggedIn } = user;

  return (
    <StyledApp>
      <Redirect
        exact
        from="/"
        to={
          isLoggedIn && userData
            ? `/${userData.username}/home`
            : `/welcome/register`
        }
      />
      <Switch>
        <Route path={`/welcome`} component={Welcome} />
        <Route path={`/:username/home`} component={Home} />
        <Route render={() => <h1>not found</h1>} />
      </Switch>
    </StyledApp>
  );
}

export default App;
