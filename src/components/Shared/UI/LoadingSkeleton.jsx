import React from "react";
import styled from "styled-components";

const StyledLoadingSkeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    -90deg,
    var(--jet) 0%,
    var(--white) 50%,
    var(--jet) 100%
  );
  background-size: 400% 400%;
  animation: waveAnimation 1.5s ease infinite;

  @keyframes waveAnimation {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -135% 0%;
    }
  }
`;
const LoadingSkeleton = () => {
  return <StyledLoadingSkeleton></StyledLoadingSkeleton>;
};

export default LoadingSkeleton;
