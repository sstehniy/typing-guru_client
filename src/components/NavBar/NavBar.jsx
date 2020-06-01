import React from "react";
import "./NavBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink, useRouteMatch } from "react-router-dom";
import { removeUser } from "../../reducers/userReducer";
import styled from "styled-components";

const NavBar = () => {
  const dispatch = useDispatch();
  const username = useSelector(({ user }) => user.data.username);
  const history = useHistory();
  const { url } = useRouteMatch();

  const signOutHandler = () => {
    dispatch(removeUser());
    history.push("/welcome/login");
  };

  return (
    <div className="navbar__container">
      <h2 className="logo">Plan-It-Make-It</h2>
      <NavMenu>
        <h2 className="username">@{username}</h2>
        <NavMenuItem text="Inbox" type="link" to={`${url}/inbox/received`} />
        <NavMenuItem text="Logout" onClick={signOutHandler} />
      </NavMenu>
    </div>
  );
};

// -----------------------------------------

const StyledNavMenu = styled.ul`
  display: flex;
`;

const NavMenu = ({ children }) => {
  return <StyledNavMenu>{children}</StyledNavMenu>;
};

// -----------------------------------------

const StyledNavMenuItem = styled.li`
  list-style: none;
  border: 3px solid var(--jet);
  box-shadow: 5px 4px 1px var(--jet);

  display: flex;
  align-items: stretch;
  justify-content: stretch;
  transition: box-shadow 0.15s ease;

  &:not(:last-child) {
    margin-right: 30px;
  }

  & a {
    text-decoration: none;
  }
  & button {
    background: none;
    border: none;
    font-weight: bold;
  }
  & a,
  button {
    flex-grow: 1;
    color: var(--salmon);
    font-size: 1.2rem;
    text-transform: uppercase;
    color: var(--jet);
    cursor: pointer;
    padding: 3px 15px;
  }
  &:hover {
    box-shadow: 0 0 0 var(--jet);
    background-color: var(--jet);

    & a,
    button {
      color: var(--salmon);
    }
  }
`;

const NavMenuItem = ({
  type = "button",
  text = "NavMenuItem",
  onClick = () => {},
  to = "/",
}) => {
  return (
    <StyledNavMenuItem onClick={onClick}>
      {type === "link" && <NavLink to={to}>{text}</NavLink>}
      {type === "button" && <button onClick={onClick}>{text}</button>}
    </StyledNavMenuItem>
  );
};

export default NavBar;
