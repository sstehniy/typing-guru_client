import React, { useState } from "react";
import Backdrop from "../Shared/UI/Backdrop";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "../../reducers/uiReducer";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled, { css } from "styled-components";
import { fetchUsersByUsername } from "../../sevices/userService";
import { sendInvitationService } from "../../sevices/invitationService";

import { ReactComponent as DeclineSVG } from "../../assets/shapes-and-symbols.svg";
import { ReactComponent as SearchSVG } from "../../assets/search.svg";
import { ReactComponent as ArrowSVG } from "../../assets/multimedia-option.svg";

const StyledUserSearch = styled.div`
  position: relative;
  height: 450px;
  width: 325px;
  background-color: var(--milk);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 4px solid var(--salmon);

  & #close__btn {
    position: absolute;
    height: 15px;
    width: 15px;
    top: 7px;
    right: 7px;
    border: none;
    cursor: pointer;
  }

  & h1 {
    text-align: center;
    text-transform: uppercase;
    margin: 15px 0;
    display: block;
    color: var(--jet);
    letter-spacing: 2px;
  }
`;

const UserSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const userData = useSelector(({ user }) => user.data);
  const history = useHistory();
  const dispatch = useDispatch();
  const { folderId } = useRouteMatch().params;

  const inputChangeHandler = e => {
    setInputValue(e.target.value);
  };

  const closeViewHandler = e => {
    if (
      e.target.parentNode.id === "backdrop" ||
      e.target.parentNode.id === "close__btn" ||
      e.target.id === "close__btn"
    )
      history.push(`/${userData.username}/home`);
  };

  const searchHandler = async () => {
    if (!inputValue.trim().length) return;
    setUsers([]);
    setIsLoading(true);
    const users = await fetchUsersByUsername(inputValue, userData.id);
    setUsers(users);
    setIsLoading(false);
    setInputValue("");
  };

  const sendInvitationHandler = async username => {
    setIsLoading(true);
    try {
      console.log(username, folderId);
      await sendInvitationService(username, folderId);

      dispatch(
        setNotification({
          header: "Success",
          body: "You successfuly sent the share invitation",
        })
      );
    } catch (error) {
      dispatch(
        setNotification({
          header: "Error",
          body: "You already sent an invitation to this user",
        })
      );
    } finally {
      setIsLoading(false);
      history.push(`/${userData.username}/home`);
    }
  };
  return (
    <Backdrop onClick={closeViewHandler}>
      <StyledUserSearch>
        <h1>Search Users</h1>
        <div onClick={closeViewHandler} id="close__btn">
          <DeclineSVG />
        </div>
        <SearchInput
          inputValue={inputValue}
          onChange={inputChangeHandler}
          onSearch={searchHandler}
        />
        <UserList
          isLoading={isLoading}
          users={users}
          onSend={sendInvitationHandler}
        />
      </StyledUserSearch>
    </Backdrop>
  );
};
// -----------------------------------------

const StyledSearchInput = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;

  & input {
    flex: 1;
    outline: none;
    margin-right: 15px;
    box-shadow: 3px 3px 1px var(--jet);
    padding: 0 10px;
    font-size: 1.2rem;
  }
`;

const SearchInput = ({
  inputValue: value,
  onChange = () => {},
  onSearch = () => {},
}) => {
  return (
    <StyledSearchInput>
      <input type="text" value={value} onChange={onChange} />
      <IconWrapper onClick={onSearch}>
        <SearchSVG />
      </IconWrapper>
    </StyledSearchInput>
  );
};

// -----------------------------------------

const StyledUserList = styled.ul`
  position: relative;
  margin: 15px 0;
  overflow-y: scroll;
  width: 90%;
  border: 2px solid var(--jet);
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;

  & h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const UserList = ({ isLoading = false, users = [], onSend = () => {} }) => {
  return (
    <StyledUserList>
      {isLoading ? (
        [1, 2, 3, 4, 5].map(n => <LoadingItem key={n} />)
      ) : users.length ? (
        users.map(u => (
          <UserCard key={u.id} user={u} onClick={() => onSend(u.username)} />
        ))
      ) : (
        <h2>Empty</h2>
      )}
    </StyledUserList>
  );
};

// -----------------------------------------

const StyledIconWrapperr = styled.div`
  position: relative;
  padding: 4px;
  border: 2px solid var(--jet);
  height: 30px;
  width: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: var(--jet);
  }
  &:hover svg {
    transform: scale(1.1);
    fill: var(--milk);
  }
  & svg {
    width: 100%;
    height: auto;
    transition: all 0.3s ease;

    &#arrow {
      transform: rotate(-90deg);
    }
  }
`;

const IconWrapper = ({ children, onClick = () => {} }) => {
  return <StyledIconWrapperr onClick={onClick}>{children}</StyledIconWrapperr>;
};

// -----------------------------------------

const StyledUserCard = styled.li`
  height: 40px;
  width: 100%;
  margin: 10px;
  background-color: var(--white);
  border: 2px solid var(--jet);
  box-shadow: 3.5px 3.5px 1px var(--jet);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  & .info {
    font-size: 1.2rem;
  }
  & .info__loading {
    position: relative;
    height: 25px;
    width: 35%;
  }
  & .icons {
    display: flex;

    & div:not(:last-child) {
      margin-right: 10px;
    }
  }

  & .icons__loading {
    display: flex;

    & div:not(:last-child) {
      margin-right: 10px;
    }
  }
`;

const UserCard = ({ user = { username: "lisasasa" }, onClick = () => {} }) => {
  return (
    <StyledUserCard>
      <p className="info">@{user.username}</p>
      <IconWrapper onClick={onClick}>
        <ArrowSVG id="arrow" />
      </IconWrapper>
    </StyledUserCard>
  );
};

// -----------------------------------------

const LoadingSkeleteon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: ${props =>
    props.br
      ? css`
          ${props.br}px
        `
      : ""};
  background-image: linear-gradient(
    -90deg,
    var(--jet) 0%,
    var(--white) 50%,
    var(--jet) 100%
  );
  background-size: 400% 400%;
  animation: waveAnimation 2s linear infinite;
  @keyframes waveAnimation {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -135% 0%;
    }
  }
`;

const LoadingItem = () => {
  return (
    <StyledUserCard>
      <div className="info__loading">
        <LoadingSkeleteon br={5} />
      </div>
      <div className="icons__loading">
        <IconWrapper>
          <LoadingSkeleteon />
        </IconWrapper>
      </div>
    </StyledUserCard>
  );
};

export default UserSearch;
