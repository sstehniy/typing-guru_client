import React from "react";
import styled from "styled-components";
import RatingContainer from "../Rating";
import { Button } from "../Shared/Button";

type ResultModalProps = {
  username?: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  rating: 1 | 2 | 3;
  onGoBack: () => void;
  onTryAgain: () => void;
};

const StyledResultModal = styled.div`
  position: absolute;
  opacity: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 300px;
  width: 480px;
  padding: 35px 15px 20px 15px;
  top: 100%;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.main_bg};
  box-shadow: ${({ theme }) => theme.box_shadow_lg};

  animation: popUp 0.5s 0.5s forwards ease;

  @keyframes popUp {
    from {
      opacity: 0.5;
      top: 100%;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 1;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

const Text = styled.p`
  text-align: center;
  margin: 15px 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.black};
`;

const ScoresContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const ScoreWrapper = styled.div`
  position: relative;
  height: 100px;

  & span#number {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    color: ${({ theme }) => theme.black};
  }

  & span#label {
    position: absolute;
    font-size: 0.9rem;
    top: 50%;
    width: 140px;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    color: ${({ theme }) => theme.black};
  }
`;

const ModalFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
`;

const ResultModal: React.FC<ResultModalProps> = ({
  wpm,
  cpm,
  accuracy,
  rating,
  onGoBack,
  onTryAgain,
}) => {
  return (
    <StyledResultModal>
      <RatingContainer rating={rating} animated />
      <Text>Your Scores</Text>
      <ScoresContainer>
        <ScoreWrapper>
          <span id="number">{wpm}</span>
          <span id="label">Words per Minute</span>
        </ScoreWrapper>
        <ScoreWrapper>
          <span id="number">{cpm}</span>
          <span id="label">Charachters per Minute</span>
        </ScoreWrapper>
        <ScoreWrapper>
          <span id="number">{accuracy}%</span>
          <span id="label">Typing Accuracy</span>
        </ScoreWrapper>
      </ScoresContainer>
      <ModalFooter>
        <Button primary onClick={onTryAgain}>
          Try Again
        </Button>
        <Button danger onClick={onGoBack}>
          Go Back
        </Button>
      </ModalFooter>
    </StyledResultModal>
  );
};

export default ResultModal;
