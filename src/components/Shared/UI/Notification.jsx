import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import { removeNotification } from "../../../reducers/uiReducer";
import { CSSTransition } from "react-transition-group";
import { ReactComponent as CloseSVG } from "../../../assets/shapes-and-symbols.svg";

const StyledNotification = styled.div`
  position: relative;
  width: 300px;
  background-color: var(--jet);
  margin: 15px;

  margin-top: 0;
  box-shadow: 0 1px 5.3px rgba(0, 0, 0, 0.092),
    0 2.2px 12.1px rgba(0, 0, 0, 0.124), 0 3.9px 21px rgba(0, 0, 0, 0.145),
    0 6.1px 33.4px rgba(0, 0, 0, 0.164), 0 9.5px 51.6px rgba(0, 0, 0, 0.184),
    0 14.8px 80.5px rgba(0, 0, 0, 0.213), 0 24.5px 133.6px rgba(0, 0, 0, 0.263);
  border-radius: 2px;
  padding: 8px 10px;

  & h2 {
    font-size: 1.6rem;
    color: var(--lime);
  }
  & p {
    color: var(--white);
  }

  & .close__wrapper {
    position: absolute;
    right: 10px;
    top: 5px;
    width: 12px;
    height: 12px;
    cursor: pointer;

    & svg {
      fill: var(--red);
    }
  }

  &.notification-slide-enter {
    opacity: 0;
    transform: translateX(-400px);
  }
  &.notification-slide-enter-active {
    transition: all ${({ timeOut }) => timeOut}ms ease;
    opacity: 1;
    transform: translateX(0);
  }
  &.notification-slide-exit {
    opacity: 1;
    transform: translateX(0);
  }
  &.notification-slide-exit-active {
    opacity: 0;
    transform: translateX(-400px);
    transition: all ${({ timeOut }) => timeOut}ms ease;
  }
`;
const TIMEOUT = 500;
const Notification = ({
  id,
  header = "information",
  body = "This is notification text",
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => dispatch(removeNotification(id)), TIMEOUT);
    }, 5000);
  }, []);

  const removeNotificationHandler = useCallback(id => {
    setShowNotification(false);
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, TIMEOUT);
  }, []);
  return (
    <CSSTransition
      in={showNotification}
      timeout={TIMEOUT}
      classNames="notification-slide"
      mountOnEnter
      unmountOnExit
    >
      <StyledNotification id={id} timeOut={TIMEOUT}>
        <h2 className="notification__header">{header}</h2>
        <p className="notification__body">{body}</p>
        <div
          className="close__wrapper"
          onClick={() => removeNotificationHandler(id)}
        >
          <CloseSVG />
        </div>
      </StyledNotification>
    </CSSTransition>
  );
};

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Notification;
