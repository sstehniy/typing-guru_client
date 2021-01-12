import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Tooltip from "../Shared/Tooltip";

export type NavButtonProps = {
  name: string;
  icon: JSX.Element;
  path?: string;
  onClick?: () => void;
  ref?: string;
};

const StyledNavLink = styled(NavLink)`
  position: relative;
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(0, 0, 0, 0.35);
    transition: background-color 0.15s ease;
  }

  & svg {
    flex: 1;
    width: 22px;
    height: 22px;
  }

  &.active {
    background-color: rgba(0, 0, 0, 0.6);

    & svg {
      fill: ${({ theme }) => theme.blue};
    }
  }
`;

const StyledNavButton = styled.button`
  position: relative;
  border: none;
  cursor: pointer;
  outline: none;
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.2);

  & svg {
    flex: 1;
    width: 22px;
    height: 22px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);

    & svg {
      fill: ${({ theme }) => theme.blue};
    }
  }
`;

const NavButton: React.FC<NavButtonProps> = ({
  name,
  icon,
  path,
  onClick = () => {}
}) => {
  return (
    <Tooltip
      text={name}
      position="bottom"
      render={ref =>
        path ? (
          <StyledNavLink to={path} activeClassName="active" ref={ref}>
            {icon}
          </StyledNavLink>
        ) : (
          <StyledNavButton ref={ref} onClick={onClick}>
            {icon}
          </StyledNavButton>
        )
      }
      style={{
        marginLeft: "15px"
      }}
    />
  );
};

export default NavButton;
