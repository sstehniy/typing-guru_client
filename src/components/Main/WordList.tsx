import React from "react";
import styled from "styled-components";
import Word from "./Word";
import RetryButton from "./RetryButton";

type WordListProps = {
  loading: boolean;
  words: string[];
  error: any;
  setRef: (node: HTMLDivElement | null) => void;
  offset: number;
  wordsToInputMap: {
    [key: number]: boolean | null;
  }[];
  currentWordIndex: number;
  currentLetterIndex: number;
  onRetryClick: () => void;
};

const WordListWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 150px;
  background-color: rgb(230, 230, 230);
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 150px;
    box-shadow: 0 0 10px rgba(230, 230, 230, 0.5);
    background-image: linear-gradient(
      rgba(230, 230, 230, 0.95),
      rgba(230, 230, 230, 0.03)
    );
  }

  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 150px;
    box-shadow: 0 0 10px rgba(230, 230, 230, 0.5);
    background-image: linear-gradient(
      rgba(230, 230, 230, 0.03),
      rgba(230, 230, 230, 0.95)
    );
  }
`;

const StyledWordList = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  min-width: 100%;
  display: flex;
  align-items: center;
  transition: left 0.08s ease-in;
`;

const WordList: React.FC<WordListProps> = ({
  loading,
  words,
  error,
  setRef,
  offset,
  wordsToInputMap,
  currentLetterIndex,
  currentWordIndex,
  onRetryClick
}) => {
  return (
    <WordListWrapper>
      <RetryButton onClick={onRetryClick} loading={loading} />
      <StyledWordList style={{ left: `calc(50% - ${offset}px)` }}>
        {loading && <p style={{ justifySelf: "center" }}>Loading...</p>}
        {error && <p>Error...</p>}
        {!!words.length &&
          words.map((w, i) => (
            <Word
              word={w}
              key={`word-${w}`}
              setRef={setRef}
              charMap={wordsToInputMap[i]}
              isCurrentWord={i === currentWordIndex}
              currentLetterIndex={currentLetterIndex}
            />
          ))}
      </StyledWordList>
    </WordListWrapper>
  );
};

export default WordList;
