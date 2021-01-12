import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAuthContext } from "../../context/userContext";
import { ReactComponent as ExitIcon } from "../../assets/exit.svg";
import { ReactComponent as SettingsIcon } from "../../assets/settings.svg";

const StyledUserAdmin = styled.div`
  position: absolute;
  z-index: 1;
  right: 0;
  overflow: hidden;
  top: calc(100% + 10px);
  width: 200px;
  background-color: ${({ theme }) => theme.main_bg};
  box-shadow: ${({ theme }) => theme.box_shadow_sm};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 10px;
  padding: 5px 8px 6px 8px;

  & > hr {
    margin: 5px 0 3px 0;
    background-color: ${({ theme }) => theme.sub_bg};
  }
`;

const ActionButton = styled.div`
  height: 38px;
  border-radius: 7px;
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;

  & > svg {
    width: 19px;
  }

  & span {
    font-size: 0.9rem;
    margin-left: 15px;
    font-weight: 700;
  }

  &:hover {
    background-color: ${({ theme }) => theme.sub_bg};
  }
`;

const UserAdmin: React.FC<{
  handleClickOutside: () => void;
  navBarRef: React.RefObject<any>;
  close: () => void;
}> = ({ handleClickOutside, navBarRef, close }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, handleClickOutside, navBarRef);
  const { logoutUser } = useAuthContext();

  return (
    <StyledUserAdmin ref={containerRef}>
      <ActionButton>
        <SettingsIcon />
        <span>Settings</span>
      </ActionButton>
      <hr />
      <ActionButton
        onClick={() => {
          logoutUser();
          close();
        }}
      >
        <ExitIcon />
        <span>Logout</span>
      </ActionButton>
    </StyledUserAdmin>
  );
};

export default UserAdmin;
