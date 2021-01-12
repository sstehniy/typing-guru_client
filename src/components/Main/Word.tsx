import React from "react";
import styled from "styled-components";

type WordProps = {
  word: string;
  setRef: (node: HTMLDivElement | null) => void;
  charMap: { [key: number]: boolean | null } | null;
  isCurrentWord: boolean;
  currentLetterIndex: number;
};

const StyledWord = styled.div`
  margin: 0 20px;

  & span {
    position: relative;
    font-size: 2.2rem;
    margin-right: 2px;
    font-family: "Concert One", cursive;
    color: #110303;

    &.correct {
      color: #9cbfd3;
    }

    &.incorrect {
      color: red;
    }

    &.underlined:before {
      content: "";
      position: absolute;
      bottom: -12px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #9cbfd3;
    }
  }
`;

const Word: React.FC<WordProps> = ({
  word,
  setRef,
  charMap,
  isCurrentWord,
  currentLetterIndex,
}) => {
  return (
    <StyledWord ref={setRef}>
      {word.split("").map((ch, i) => (
        <span
          // eslint-disable-next-line
          key={i}
          className={`${
            charMap
              ? charMap[i] === true
                ? "correct"
                : charMap[i] === false
                ? "incorrect"
                : ""
              : ""
          }${isCurrentWord && i === currentLetterIndex ? "underlined" : ""}`}
        >
          {ch}
        </span>
      ))}
    </StyledWord>
  );
};

export default Word;
