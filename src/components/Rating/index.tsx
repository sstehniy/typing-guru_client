import React from "react";
import styled from "styled-components";
import RatingStar from "./RatingStar";

export type RatingContainerProps = {
  animated: boolean;
  rating: 1 | 2 | 3;
  size?: {
    height: number;
    width: number;
  };
};

const StyledRatingContainer = styled.div`
  width: 60%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RatingContainer: React.FC<RatingContainerProps> = ({ animated, rating, size }) => {
  return (
    <StyledRatingContainer style={{ height: size?.height || 70 }}>
      {[1, 2, 3].map(v => (
        <RatingStar
          key={v}
          active={v <= rating}
          animated={animated}
          animationDelay={animated ? 1 + 0.2 * v : undefined}
          size={size}
        />
      ))}
    </StyledRatingContainer>
  );
};

export default RatingContainer;
