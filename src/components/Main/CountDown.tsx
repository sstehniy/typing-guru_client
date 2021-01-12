import React from "react";
import styled from "styled-components";

const StyledCountDown = styled.div`
  position: relative;
  width: 70px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  border-radius: 35px;
  box-shadow: ${({ theme }) => theme.box_shadow_st};
  background-color: rgb(230, 230, 230);

  & span {
    left: 50%;
    transform: translateX(-50%);
  }

  & span#number {
    position: absolute;
    font-size: 1.8rem;
    top: 10px;
  }

  & span#sec {
    position: absolute;
    bottom: 10px;
    font-size: 0.7rem;
  }
`;
const CountDown: React.FC<{ remainingTime: number }> = ({ remainingTime }) => {
  return (
    <StyledCountDown>
      <span id="number">{remainingTime}</span> <span id="sec">SEC</span>
    </StyledCountDown>
  );
};

export default CountDown;
