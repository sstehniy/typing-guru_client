import React, { useEffect } from "react";
import "./Home.scss";
import Controls from "../../components/Controls/Controls";
import Todos from "../../components/Todos/Todos";
import NavBar from "../../components/NavBar/NavBar";
import Notifications from "../Notifications/Notifications";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../reducers/uiReducer";
import {
  initFolders,
  setFoldersLoading,
  resetFoldersLoading,
} from "../../reducers/collectionReducer";
import { fetchUser } from "../../sevices/userService";
import { setToken } from "../../sevices/protectedApiClient";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Inbox from "../../components/Inbox/Inbox";
import UserSearch from "../../components/UserSearch/UserSearch";

const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(({ user }) => user.data);
  const match = useRouteMatch();

  useEffect(() => {
    const initUserAndFoldersAsync = async () => {
      dispatch(setFoldersLoading());
      const fetchedUser = await fetchUser(userData.id);
      if (!fetchedUser.emailVerified) {
        const message = {
          header: "Warning",
          body: "Please verify your email to be able to manage todos",
        };
        dispatch(setNotification(message));
      } else {
        const savedUser = localStorage.getItem("TODO_APP_USER");
        const parsedSavedUser = JSON.parse(savedUser);
        parsedSavedUser.isVerified = true;
        localStorage.removeItem("TODO_APP_USER");
        localStorage.setItem("TODO_APP_USER", JSON.stringify(parsedSavedUser));
      }
      setToken(userData.token);
      await dispatch(initFolders(userData.id));
      dispatch(resetFoldersLoading());
    };
    initUserAndFoldersAsync();
  }, []);

  return (
    <div className="home__container">
      <Notifications />
      <NavBar />
      <TodosMainContainer />
      <Switch>
        <Route path={`${match.path}/inbox`} component={Inbox} />
        <Route
          path={`${match.path}/:folderId/user-search`}
          component={UserSearch}
        />
      </Switch>
    </div>
  );
};

const StyledTodosMainContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const TodosMainContainer = () => {
  return (
    <StyledTodosMainContainer>
      <Controls />
      <Todos />
    </StyledTodosMainContainer>
  );
};

export default Home;
