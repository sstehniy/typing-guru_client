import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { Route, Redirect, Switch } from "react-router-dom";
import { lightTheme } from "./theme";
import Header from "./components/Header";
import Main from "./components/Main";
import AuthProvider from "./context/userContext";
import TestHistory from "./components/TestHistory";

const StyledApp = styled.div`
  position: relative;
  overflow: auto;
  width: 100%;
  min-width: 300px;
  height: 100vh;
  padding: 10px 10px;
  background-color: ${({ theme }) => theme.main_bg};
`;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <StyledApp>
        <AuthProvider>
          <Header />
          <Redirect from="/" to="/practice" />
          <Switch>
            <Route path="/practice" component={Main} />
            <Route path="/history/:username" component={TestHistory} />
            <Route path="/history/" component={TestHistory} />
          </Switch>
        </AuthProvider>
      </StyledApp>
    </ThemeProvider>
  );
};

export default App;
