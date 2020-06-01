import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInvitationsLoading,
  resetInvitationsLoading,
  fetchInvitations,
} from "../../reducers/invitationsReducer";

import { setNotification } from "../../reducers/uiReducer";

import {
  cancelInvitationService,
  declineInvitationService,
} from "../../sevices/invitationService";

import { acceptInvitation } from "../../reducers/invitationsReducer";

import Backdrop from "../Shared/UI/Backdrop";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import {
  Switch,
  useLocation,
  useRouteMatch,
  useHistory,
  Route,
  NavLink,
} from "react-router-dom";

import { ReactComponent as CancelSVG } from "../../assets/arrows.svg";
import { ReactComponent as AcceptSVG } from "../../assets/confirm.svg";
import { ReactComponent as DeclineSVG } from "../../assets/shapes-and-symbols.svg";

const InvitationTypes = {
  RECEIVED: "received",
  SENT: "sent",
};

const StyledInbox = styled.div`
  height: 550px;
  width: 450px;
  background-color: var(--milk);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 4px solid var(--salmon);

  & h1 {
    text-align: center;
    text-transform: uppercase;
    margin: 15px 0;
    display: block;
    color: var(--jet);
    letter-spacing: 2px;
  }

  & .navlink__container {
    width: 100%;
    display: flex;
    justify-content: center;

    & a {
      text-decoration: none;
      border: 2px solid var(--jet);
      box-shadow: 3.5px 3.5px 0.5px var(--jet);
      height: 30px;
      width: 110px;
      color: var(--jet);
      margin: 0 15px;
      text-align: center;
      text-transform: uppercase;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 0 black;
        background-color: var(--jet);
        color: var(--milk);
      }
      &.active {
        box-shadow: 0 0 0 black;
        background-color: var(--jet);
        color: var(--milk);
      }
    }
  }
`;

const Inbox = () => {
  const location = useLocation();
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const userData = useSelector(({ user }) => user.data);
  const invitations = useSelector(({ invitations }) => invitations);

  useEffect(() => {
    const initInvitationsAsync = async () => {
      dispatch(setInvitationsLoading());
      try {
        await dispatch(fetchInvitations(userData.id));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(resetInvitationsLoading());
      }
    };
    initInvitationsAsync();
  }, []);

  const backdropClickedHandler = e => {
    if (e.target.parentNode.id === "backdrop")
      history.push(`/${userData.username}/home`);
  };

  return (
    <Backdrop onClick={backdropClickedHandler}>
      <StyledInbox>
        <h1>Inbox</h1>
        <div className="navlink__container">
          <NavLink to={`${match.url}/received`} activeClassName="active">
            Received
          </NavLink>
          <NavLink to={`${match.url}/sent`} activeClassName="active">
            Sent
          </NavLink>
        </div>

        <Switch location={location}>
          <Route
            path={`${match.path}/received`}
            render={() => (
              <InboxSection
                type={InvitationTypes.RECEIVED}
                invitations={invitations.received}
                isLoading={invitations.isLoading}
                user={userData}
              />
            )}
          />
          <Route
            path={`${match.path}/sent`}
            render={() => (
              <InboxSection
                type={InvitationTypes.SENT}
                invitations={invitations.sent}
                isLoading={invitations.isLoading}
                user={userData}
              />
            )}
          />
        </Switch>
      </StyledInbox>
    </Backdrop>
  );
};

// -----------------------------------------

const StyledInboxSection = styled.ul`
  position: relative;
  margin: 15px 0;
  width: 95%;
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
    transform: translateY(-50%);
  }
`;

const InboxSection = ({
  type = "",
  invitations = [],
  isLoading = false,
  user = {},
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const acceptInvitationHandler = async invId => {
    history.push(`/${user.username}/home`);
    await dispatch(acceptInvitation(invId));
  };

  const cancelInvitationHandler = async invId => {
    try {
      await cancelInvitationService(invId);
      history.push(`/${user.username}/home`);
      dispatch(
        setNotification({
          header: "Success!!!",
          body: `You cancelled your invitation`,
        })
      );
    } catch (error) {
      console.log("cancel", error);
    }
  };

  const declineInvitationHandler = async invId => {
    try {
      await declineInvitationService(invId);
      history.push(`/${user.username}/home`);
      dispatch(
        setNotification({
          header: "Success!!!",
          body: `You declined your invitation`,
        })
      );
    } catch (error) {
      console.log("decline", error);
    }
  };
  return (
    <StyledInboxSection>
      {isLoading ? (
        [1, 2, 3, 4, 5, 6].map(n => <LoadingItem key={n} />)
      ) : invitations.length ? (
        invitations.map(i => (
          <InvitationItem
            key={i.id}
            type={type}
            invitation={i}
            onAccepted={() => acceptInvitationHandler(i.id)}
            onDeclined={() => declineInvitationHandler(i.id)}
            onCanceled={() => cancelInvitationHandler(i.id)}
          />
        ))
      ) : (
        <h2>Empty</h2>
      )}
    </StyledInboxSection>
  );
};

// -----------------------------------------

const StyledInvitationItem = styled.li`
  height: 50px;
  width: 100%;
  margin: 10px;
  background-color: var(--white);
  border: 2px solid var(--jet);
  box-shadow: 3.5px 3.5px 1px var(--jet);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  & .info {
    display: flex;
    justify-content: flex-start;
    & p {
      text-transform: uppercase;
      margin-right: 10px;

      & span {
        text-transform: uppercase;
      }
    }

    & p:last-child {
      & span {
        text-transform: none;
      }
    }
  }
  & .info__loading {
    position: relative;
    height: 35px;
    width: 50%;
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
    <StyledInvitationItem>
      <div className="info__loading">
        <LoadingSkeleteon br={5} />
      </div>
      <div className="icons__loading">
        <IconWrapper icon={<LoadingSkeleteon />} />
        <IconWrapper icon={<LoadingSkeleteon />} />
      </div>
    </StyledInvitationItem>
  );
};

const InvitationItem = ({
  type = InvitationTypes.RECEIVED,
  invitation,
  onAccepted,
  onDeclined,
  onCanceled,
}) => {
  return (
    <StyledInvitationItem>
      <div className="info">
        <p>
          <span>{invitation.folder.title}</span>
        </p>
        {type === InvitationTypes.RECEIVED ? (
          <p>
            From: <span>{invitation.from.username}</span>
          </p>
        ) : (
          <p>
            To: <span>{invitation.to.username}</span>
          </p>
        )}
      </div>
      <div className="icons">
        {type === InvitationTypes.RECEIVED ? (
          <>
            <IconWrapper
              icon={<AcceptSVG style={{ fill: "green" }} />}
              onClick={onAccepted}
            />
            <IconWrapper
              icon={<DeclineSVG style={{ fill: "red" }} />}
              onClick={onDeclined}
            />
          </>
        ) : (
          <IconWrapper
            icon={<CancelSVG style={{ fill: "black" }} />}
            onClick={onCanceled}
          />
        )}
      </div>
    </StyledInvitationItem>
  );
};

InvitationItem.protoTypes = {
  type: PropTypes.oneOf([InvitationTypes.RECEIVED, InvitationTypes.SENT]),
};

// -----------------------------------------

const StyledIconWrapper = styled.div`
  position: relative;
  padding: 4px;
  border: 2px solid var(--jet);
  height: 35px;
  width: 35px;
  cursor: pointer;
  &:hover svg {
    transform: scale(1.1);
  }
  & svg {
    width: 100%;
    height: auto;
    transition: all 0.3s ease;
  }
`;

const IconWrapper = ({ icon, onClick = () => {} }) => {
  return <StyledIconWrapper onClick={onClick}>{icon}</StyledIconWrapper>;
};
export default Inbox;
