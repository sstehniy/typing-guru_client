import React from "react";
import styled from "styled-components";
import { Button } from "../Shared/Button";

const StyledStartOverlay = styled.div`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StartButton = styled(Button)`
  position: relative;
  background-color: ${({ theme }) => theme.green};
  width: 110px;
  height: 35px;
  border-radius: 14px;
  border: none;

  &:after {
    content: "";
    position: absolute;
    z-index: -2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 14px;
    border: none;
    box-shadow: 0 0 0 0px ${({ theme }) => theme.green};
    animation: wave 1.5s infinite;
  }
  @keyframes wave {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 10px ${({ theme }) => theme.green};
    }

    50% {
      transform: scale(1);
      box-shadow: 0 0 25px ${({ theme }) => theme.green};
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 10px ${({ theme }) => theme.green};
    }
  }
`;

const StartOverlay: React.FC<{ onStartClicked: () => void }> = ({ onStartClicked }) => {
  return (
    <StyledStartOverlay>
      <StartButton onClick={onStartClicked}>Start</StartButton>
    </StyledStartOverlay>
  );
};

export default StartOverlay;
