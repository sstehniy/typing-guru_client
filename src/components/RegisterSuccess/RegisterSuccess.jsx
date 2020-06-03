import React, { useEffect, useState, useRef } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { resendVerificationEmail } from "../../services/userService";
import styled from "styled-components";
import { ReactComponent as SuccessSVG } from "../../assets/success.svg";

const StyledRegisterSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & svg {
    height: 150px;
    width: auto;
    fill: ${({ theme }) => theme.colors.yellow};
  }

  & .text__container {
    margin-top: 40px;
    & h1 {
      text-align: center;
      font-size: 2.3rem;
    }

    & p {
      margin-top: 20px;
      font-size: 1.5em;
      text-align: center;
    }
  }

  & .links__container {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    & .link__wrapper {
      position: relative;
      height: 40px;
      width: 160px;
      margin: 0 calc(10px + 5vw);
      display: flex;
      align-items: stretch;
      justify-content: center;
      background-color: transparent;
      border: 2px solid ${({ theme }) => theme.colors.jet};
      box-shadow: 3.5px 3.5px 1px ${({ theme }) => theme.colors.jet};
      transition: all 0.15s ease;

      &.inactive {
        pointer-events: none;
        filter: opacity(0.5);
      }

      & a {
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        text-align: center;
        white-space: nowrap;
        text-transform: uppercase;
        font-size: 1.1rem;
        color: ${({ theme }) => theme.colors.jet};
        transition: all 0.15s ease;
      }

      &:hover {
        box-shadow: 0 0 0px ${({ theme }) => theme.colors.jet};
        background-color: ${({ theme }) => theme.colors.jet};
        & a p {
          color: ${({ theme }) => theme.colors.green};
        }
      }
    }
  }

  @media ${({ theme }) => theme.device.sm} {
    .links__container {
      flex-direction: column;
      align-items: center;
    }

    .link__wrapper:nth-child(2) {
      margin-top: 15px;
    }
  }
`;

const RegisterSuccess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(new Date().getTime());
  const [resendButtonActive, setResendButtonActive] = useState(false);
  const [countDown, setCountDown] = useState(10);
  const match = useRouteMatch();
  const userId = match.params.userId;

  const intervalRef = useRef({});

  useEffect(() => {
    intervalRef.current.interval = setInterval(() => {
      setCountDown(curr => curr - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (countDown === 0) {
      clearInterval(intervalRef.current.interval);
      setResendButtonActive(true);
      setCountDown(null);
    }
  }, [countDown]);

  const handleResendEmailClicked = async e => {
    e.preventDefault();
    clearInterval(intervalRef.current.interval);
    const timeNow = new Date().getTime();
    if (timeNow - lastSentTime < 10000)
      return console.log("less then a minute ago");
    setIsLoading(true);
    try {
      await resendVerificationEmail(userId);
      setResendButtonActive(false);
      setLastSentTime(new Date().getTime());
      setCountDown(10);
      intervalRef.current.interval = setInterval(() => {
        setCountDown(curr => curr - 1);
      }, 1000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledRegisterSuccess>
      <SuccessSVG />
      <div className="text__container">
        <h1>Congratulations!!! </h1>
        <p>
          You are now using Plan-It-Make-It.
          <br />
          I&apos;ve sent you a verification email, please check your Inbox and
          click the link to activate your account!
        </p>
      </div>
      <div className="links__container">
        <div className="link__wrapper">
          <Link to={`/welcome/login`}>
            <p>Login</p>
          </Link>
        </div>
        <div
          className={`link__wrapper ${!resendButtonActive ? "inactive" : ""}`}
        >
          <Link to="*" onClick={handleResendEmailClicked}>
            <p>
              {isLoading
                ? "Loading..."
                : resendButtonActive
                ? "Resend Email"
                : `Resend in ${countDown}s`}
            </p>
          </Link>
        </div>
      </div>
    </StyledRegisterSuccess>
  );
};

export default RegisterSuccess;
