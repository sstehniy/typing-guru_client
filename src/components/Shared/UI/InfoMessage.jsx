import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { ReactComponent as AlertSVG } from "../../../assets/alert.svg";
import { CSSTransition } from "react-transition-group";

const StyledInfoMessage = styled.p`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  margin: 0.5em 0;
  color: ${({ theme, type }) => (type === "error" ? theme.colors.red : "")};
  transition: color 0.3s ease-out;
  & svg {
    width: 15px;
    display: inline-block;
    margin-right: 5px;
    fill: ${({ theme }) => theme.colors.red};
  }
  &.drop-enter {
    opacity: 0;
    transform: translateY(-15px);
  }
  &.drop-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-in;
  }
  &.drop-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.drop-exit-active {
    opacity: 0;
    transform: translateY(-15px);
    transition: all 0.3s ease-in;
  }
`;
const InfoMessage = ({
  children: message = "message",
  type = "normal",
  style: customStyle = {},
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(true);
  }, []);

  return (
    <CSSTransition
      in={showMessage}
      timeout={300}
      classNames="drop"
      mountOnEnter
      unmountOnExit
    >
      <StyledInfoMessage type={type} style={customStyle}>
        {type === "error" && <AlertSVG />}
        {message}
      </StyledInfoMessage>
    </CSSTransition>
  );
};

InfoMessage.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(["normal", "error"]),
  customStyle: PropTypes.shape(),
};

export default InfoMessage;
