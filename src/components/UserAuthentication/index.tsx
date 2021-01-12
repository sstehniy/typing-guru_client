/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import LoginWidget from "./LoginWidget";
import RegisterWidget from "./RegisterWidget";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAuthContext } from "../../context/userContext";


enum CurrentView {
  LOGIN,
  REGISTER,
}

const StyledUserAuth = styled.div`
  position: absolute;
  z-index: 1;
  right: 0;
  overflow: hidden;
  top: calc(100% + 10px);
  width: 300px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.main_bg};
  box-shadow: ${({ theme }) => theme.box_shadow_md};
  transition: height 0.2s ease;

  .login-enter {
    transform: scale(0.8) translateX(-300px);
  }

  .login-enter-active {
    animation: login-enter 0.5s forwards ease-in-out;
  }

  .login-exit {
    transform: scale(1) translateX(0);
  }
  .login-exit-active {
    animation: login-leave 0.4s forwards ease-in-out;
  }

  .register-enter {
    transform: scale(0.8) translateX(300px);
  }

  .register-enter-active {
    animation: register-enter 0.5s forwards ease-in-out;
  }

  .register-exit {
    transform: scale(1) translateX(0);
  }

  .register-exit-active {
    animation: register-leave 0.4s forwards ease-in-out;
  }

  @keyframes login-enter {
    0% {
      transform: scale(0.85) translateX(-300px);
    }
    45% {
      transform: scale(0.85) translateX(0);
    }
    100% {
      transform: scale(1) translateX(0);
    }
  }
  @keyframes login-leave {
    0% {
      transform: scale(1) translateX(0);
    }
    45% {
      transform: scale(0.85) translateX(0);
    }
    100% {
      transform: scale(0.85) translateX(-600px);
    }
  }

  @keyframes register-enter {
    0% {
      transform: scale(0.85) translateX(300px);
    }
    45% {
      transform: scale(0.85) translateX(0);
    }
    100% {
      transform: scale(1) translateX(0);
    }
  }

  @keyframes register-leave {
    0% {
      transform: scale(1) translateX(0);
    }
    45% {
      transform: scale(0.85) translateX(0);
    }
    100% {
      transform: scale(0.85) translateX(600px);
    }
  }
`;

const UserAdmin: React.FC<{
  handleClickOutside: () => void;
  navBarRef: React.RefObject<any>;
  close: () => void;
}> = ({ handleClickOutside, navBarRef, close }) => {
  const [currentView, setCurrentView] = useState<keyof typeof CurrentView>("LOGIN");
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  useClickOutside(containerRef, handleClickOutside, navBarRef);
  const { registerUser, loginUser } = useAuthContext();

  useEffect(() => {
    if (!containerRef.current) return;
    setMaxHeight(containerRef.current.offsetHeight);
  }, [currentView]);

  const toggleCurrentView = useCallback(() => {
    switch (currentView) {
      case "LOGIN":
        setCurrentView("REGISTER");
        break;
      case "REGISTER":
        setCurrentView("LOGIN");
        break;
      default:
        return;
    }
  }, [currentView]);

  const handleRegister = useCallback(
    async (creds: {
      fullName: string;
      username: string;
      password: string;
      email: string;
    }) => {
      try {
        await registerUser(creds);
        toggleCurrentView();
      } catch (error) {
        throw error;
      }
    },
    [registerUser, toggleCurrentView]
  );

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      await loginUser({ username, password });
      close();
    },
    [close, loginUser]
  );

  return (
    <StyledUserAuth
      ref={containerRef}
      style={{ height: maxHeight ? `${maxHeight}px` : "" }}
    >
      <SwitchTransition>
        <CSSTransition
          key={currentView}
          timeout={{ enter: 600, exit: 400 }}
          unmountOnExit
          classNames={currentView === "LOGIN" ? "login" : "register"}
          onEnter={(el: any) => {
            setMaxHeight(el.offsetHeight);
          }}
        >
          {currentView === "LOGIN" ? (
            <LoginWidget
              toggleCurrentView={toggleCurrentView}
              handleLogin={handleLogin}
            />
          ) : (
            <RegisterWidget
              toggleCurrentView={toggleCurrentView}
              handleRegister={handleRegister}
            />
          )}
        </CSSTransition>
      </SwitchTransition>
    </StyledUserAuth>
  );
};

export default UserAdmin;
