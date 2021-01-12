import React from "react";
import styled from "styled-components";

type TypingStatsProps = {
  wpm: number;
  cpm: number;
  accuracy: number;
};

const StyledTypingStats = styled.div`
  width: 70%;
  display: flex;
  justify-content: space-evenly;
  margin-top: 80px;
`;

const StatWrapper = styled.div`
  padding: 3px 13px;
  background-color: rgb(230, 230, 230);
  border-radius: 5px;
  box-shadow: ${({ theme }) => theme.box_shadow_sm};

  & span {
    font-variant-numeric: tabular-nums;
    font-size: 1.8rem;
  }
`;

const TypingStats: React.FC<TypingStatsProps> = ({ wpm, cpm, accuracy }) => {
  return (
    <StyledTypingStats>
      <StatWrapper>
        <p>
          <span>{wpm}</span> WPM
        </p>
      </StatWrapper>
      <StatWrapper>
        <p>
          <span>{cpm}</span> CPM
        </p>
      </StatWrapper>
      <StatWrapper>
        <p>
          <span>{accuracy}</span>% ACC
        </p>
      </StatWrapper>
    </StyledTypingStats>
  );
};

export default TypingStats;
