import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles//_variables.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { device } from "./Theme";
import { Provider } from "react-redux";
import { store } from "./store";
import { initUser } from "./reducers/userReducer";

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
   
    color: var(--dark);
    box-sizing: border-box;
  }

  html, body{
    font-size: 16px;
    font-family: 'Dosis', sans-serif;
  }
`;
store.dispatch(initUser());

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <ThemeProvider theme={{ device }}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </Provider>
  </Router>,
  document.getElementById("root")
);

/* 
  //TODO: create a refresh button on folders near 'add' button 
  //TODO: add a navbar component to display username
  //! TODO: refactor state management(centralized action types source)
  ! TODO: refactor Todos List (NO SPAGETTI CODE)
*/
