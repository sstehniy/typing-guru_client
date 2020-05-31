import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, useHistory } from "react-router-dom";
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
  const history = useHistory();
  const user = useSelector(({ user }) => user);
  const { data: userData, isLoggedIn } = user;

  useEffect(() => {
    if (isLoggedIn && userData) history.push(`/${userData.username}/home`);
    else history.push(`/welcome/register`);
  }, []);

  return (
    <StyledApp>
      <Switch>
        <Route path={`/welcome`} component={Welcome} />
        <Route path={`/:username/home`} component={Home} />
      </Switch>
    </StyledApp>
  );
}

export default App;
