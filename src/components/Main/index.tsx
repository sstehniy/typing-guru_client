import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useFetchData } from "../../hooks/useFetchResource";
import { useAuthContext } from "../../context/userContext";
import { ReactComponent as Keyboard } from "../../assets/keyboard.svg";
import Wordlist from "./WordList";
import CountDown from "./CountDown";
import TypingStats from "../ResultModal/TypingStats";
import Backdrop from "../Shared/Backdrop";
import ResultModal from "../ResultModal";
import StartOverlay from "./StartOverlay";
import { saveResult } from "../../api/saveResult";

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
  outline: none;

  & svg#keyboard {
    width: 70%;
    min-width: 300px;
    max-width: 700px;
    border-radius: 7px;
    background-color: #e0e0e0;
    margin-bottom: 40px;
    box-shadow: ${({ theme }) => theme.box_shadow_lg};
  }
`;

const WordListWrapper = styled.div`
  position: relative;
  width: 80%;
  margin-top: 40px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.box_shadow_md};
`;

const TIME = 60;

const Main: React.FC = () => {
  const [testState, setTestState] = useState<"started" | "finished" | null>(null);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeRemainig, setTimeRemaining] = useState(TIME);
  const [listLeftOffset, setListLeftOffset] = useState(0);
  const [wordsToInputMap, setWordsToInputMap] = useState<
    {
      [key: number]: boolean | null;
    }[]
  >([]);
  const tryCount = useRef(1);
  const { loading, data: words, error } = useFetchData<string>(
    "/api/words",
    tryCount.current
  );
  const [wordsRefs, setWordsRefs] = useState<HTMLDivElement[]>([]);
  const [totalWordsSoFar, setTotalWordsSoFar] = useState(0);
  const [totalLettersSoFar, setTotalLettersSoFar] = useState(0);
  const [totalCorrectLetters, setTotalCorrectLetters] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [rating, setRating] = useState<1 | 2 | 3>(1);
  const [showResultModal, setShowResultModal] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const keyboardRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    if (!words.length) return;
    setWordsToInputMap(
      words.map(w => {
        const obj: { [key: number]: boolean | null } = {};
        w.split("").forEach((_: string, i: number) => {
          obj[i] = null;
        });
        return obj;
      })
    );
  }, [words]);

  useEffect(() => {
    if (totalCorrectLetters === 0 || totalLettersSoFar === 0) return;
    setAccuracy(Math.floor((totalCorrectLetters / totalLettersSoFar) * 100));
  }, [totalLettersSoFar, totalCorrectLetters]);

  useEffect(() => {
    if (!totalLettersSoFar) return;
    setCpm(
      Math.min(
        Math.floor((totalLettersSoFar / (TIME - Math.floor(timeRemainig))) * TIME),
        500
      )
    );
  }, [timeRemainig, totalLettersSoFar]);

  useEffect(() => {
    if (!totalWordsSoFar) return;
    setWpm(Math.floor((totalWordsSoFar / (TIME - timeRemainig)) * TIME));
  }, [timeRemainig, totalWordsSoFar]);

  useEffect(() => {
    if (testState === "finished") return;

    const handleKeyStroke = (e: KeyboardEvent) => {
      if (testState === null && startClicked) {
        setTestState("started");
        intervalRef.current = setInterval(() => {
          setTimeRemaining(prev => prev - 1);
        }, 1000);
      }

      if (e.keyCode === 8 || e.keyCode === 46) {
        if (currentLetterIndex > 0) {
          if (wordsToInputMap[currentLetterIndex][currentLetterIndex]) {
            setTotalCorrectLetters(totalCorrectLetters - 1);
            setTotalLettersSoFar(totalLettersSoFar - 1);
          }
          setCurrentLetterIndex(currentLetterIndex - 1);
          setWordsToInputMap(
            wordsToInputMap.map((v, i) =>
              i === currentWordIndex ? { ...v, [currentLetterIndex - 1]: null } : v
            )
          );

          return;
        }
      }

      if (e.keyCode === 32) {
        if (currentLetterIndex <= words[currentWordIndex].length - 1) {
          for (let i = currentLetterIndex; i < words[currentWordIndex].length; i += 1) {
            wordsToInputMap[currentWordIndex][i] = false;
          }
        }

        setTotalWordsSoFar(prev => prev + 1);
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentLetterIndex(0);
      }
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (
          currentLetterIndex === words[currentWordIndex].length - 1 &&
          wordsToInputMap[currentWordIndex][currentLetterIndex] !== null
        )
          return;
        setTotalLettersSoFar(totalLettersSoFar + 1);
        if (e.key === words[currentWordIndex][currentLetterIndex]) {
          setTotalCorrectLetters(totalCorrectLetters + 1);
          setCurrentLetterIndex(currentLetterIndex + 1);
          setWordsToInputMap(prev =>
            prev.map((v, i) =>
              i === currentWordIndex ? { ...v, [currentLetterIndex]: true } : v
            )
          );
        } else {
          setCurrentLetterIndex(currentLetterIndex + 1);
          setWordsToInputMap(prev =>
            prev.map((v, i) =>
              i === currentWordIndex ? { ...v, [currentLetterIndex]: false } : v
            )
          );
        }
      }
    };

    if (!startClicked) document.removeEventListener("keydown", handleKeyStroke);
    else document.addEventListener("keydown", handleKeyStroke);
    // eslint-disable-next-line
    return () => {
      document.removeEventListener("keydown", handleKeyStroke);
    };
  }, [
    currentLetterIndex,
    currentWordIndex,
    startClicked,
    testState,
    totalCorrectLetters,
    totalLettersSoFar,
    words,
    wordsToInputMap
  ]);

  useEffect(() => {
    (async () => {
      if (testState === "finished") {
        setShowResultModal(true);
        if (user) {
          try {
            const result = await saveResult({
              wpm,
              cpm,
              acc: accuracy,
              score: rating,
              username: user.username
            });
            console.log("Result saved", result);
          } catch (_) {
            console.error("failed to save result");
          }
        }
      }
    })();
  }, [accuracy, cpm, rating, testState, user, wpm]);

  useEffect(() => {
    if (!keyboardRef.current || !words.length || !startClicked) return;
    // eslint-disable-next-line
    keyboardRef.current.querySelectorAll(`path`)?.forEach((n: any) => {
      if (n.classList.contains("active")) {
        n.classList.remove("active");
      }
    });
    if (currentLetterIndex === words[currentWordIndex].length) {
      // eslint-disable-next-line
      keyboardRef.current.querySelector(`path#space`)?.classList.toggle("active");
    }
    // eslint-disable-next-line
    keyboardRef.current
      .querySelector(`path#${words[currentWordIndex][currentLetterIndex]}`)
      ?.classList.toggle("active");
  }, [currentLetterIndex, currentWordIndex, words, startClicked]);

  useEffect(() => {
    if (!words.length || !wordsRefs.length) return;
    if (currentWordIndex === 0) {
      setListLeftOffset(
        prev => prev + wordsRefs[currentWordIndex].getBoundingClientRect().width / 2 + 20
      );
    } else {
      setListLeftOffset(
        prev =>
          prev +
          wordsRefs[currentWordIndex - 1].getBoundingClientRect().width / 2 +
          wordsRefs[currentWordIndex].getBoundingClientRect().width / 2 +
          40
      );
    }
  }, [currentWordIndex, words.length, wordsRefs]);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    setWordsRefs(prev => [...prev, node]);
  }, []);

  const tryAgainHandler = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    // eslint-disable-next-line
    keyboardRef.current
      .querySelector(`path#${words[currentWordIndex][currentLetterIndex]}`)
      ?.classList.toggle("active");
    setStartClicked(false);
    setAccuracy(0);
    setCpm(0);
    setCurrentLetterIndex(0);
    setCurrentWordIndex(0);
    setListLeftOffset(0);
    setTestState(null);
    setTimeRemaining(TIME);
    setTotalCorrectLetters(0);
    setTotalLettersSoFar(0);
    setTotalWordsSoFar(0);
    setWordsRefs([]);
    setWordsToInputMap([]);
    setWpm(0);
    setRating(1);
    tryCount.current += 1;
  };

  useEffect(() => {
    if (timeRemainig === 0 && testState === "started") {
      setTestState("finished");
      if (wpm < 10) setRating(1);
      if (wpm >= 10 && wpm <= 20) setRating(2);
      if (wpm > 20) setRating(3);
      setShowResultModal(true);
      setStartClicked(false);
      clearInterval(intervalRef.current);
    }
  }, [testState, timeRemainig, wpm]);

  const goBackHandler = () => {
    setShowResultModal(false);
  };

  const goBackAndTryAgain = () => {
    setShowResultModal(false);
    tryAgainHandler();
    setStartClicked(false);
  };

  const startClickedHandler = () => {
    if (testState !== null) tryAgainHandler();
    setStartClicked(true);
  };

  return (
    <StyledMain>
      <Keyboard ref={keyboardRef} />
      <CountDown remainingTime={timeRemainig} />
      <WordListWrapper>
        <Wordlist
          loading={loading}
          words={words}
          error={error}
          setRef={setRef}
          offset={listLeftOffset}
          wordsToInputMap={wordsToInputMap}
          currentWordIndex={currentWordIndex}
          currentLetterIndex={currentLetterIndex}
          onRetryClick={tryAgainHandler}
        />
        {!startClicked && <StartOverlay onStartClicked={startClickedHandler} />}
      </WordListWrapper>
      <TypingStats wpm={wpm} cpm={cpm} accuracy={accuracy} />
      <Backdrop
        inProp={showResultModal}
        onClickOutside={() => {
          setShowResultModal(false);
        }}
        render={() => (
          <ResultModal
            wpm={wpm}
            cpm={cpm}
            accuracy={accuracy}
            rating={rating}
            onGoBack={goBackHandler}
            onTryAgain={goBackAndTryAgain}
          />
        )}
      />
    </StyledMain>
  );
};

export default Main;
