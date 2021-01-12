import React from "react";
import styled from "styled-components";
import { ReactComponent as EmptyStar } from "../../assets/rating-star-empty.svg";
import { ReactComponent as FilledStar } from "../../assets/rating-star-filled.svg";

type RatingStarProp = {
  active: boolean;
  animationDelay: number | undefined;
  animated: boolean;
  size?: {
    height: number;
    width: number;
  };
};

type StyledFilledStarProps = {
  delay: number | undefined;
};

const StyledEmptyStar = styled(EmptyStar)`
  position: absolute;
  top: 0;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  fill: black;
`;

const StyledFilledStart = styled(FilledStar)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
`;

const StyledFilledStarAnimated = styled(StyledFilledStart)<StyledFilledStarProps>`
  transform: scale(0);
  opacity: 0;
  animation: scale 0.5s ${({ delay }) => `${delay}s`} forwards ease;

  @keyframes scale {
    from {
      opacity: 0;
      transform: scale(0);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const RatingStar: React.FC<RatingStarProp> = ({
  active,
  animationDelay,
  animated,
  size
}) => {
  return (
    <div
      style={{
        height: size?.height || 70,
        width: size?.width || 70,
        position: "relative",
        display: "flex",
        alignItems: "center"
      }}
    >
      <StyledEmptyStar />
      {active ? (
        animated ? (
          <StyledFilledStarAnimated delay={animationDelay} />
        ) : (
          <StyledFilledStart />
        )
      ) : null}
    </div>
  );
};

export default RatingStar;
