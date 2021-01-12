import React, { useMemo } from "react";
import styled from "styled-components";
import { useAuthContext } from "../../context/userContext";
import { ReactComponent as PractiseIcon } from "../../assets/electric-keyboard.svg";
import { ReactComponent as HistoryIcon } from "../../assets/history.svg";
import { ReactComponent as RankingsIcon } from "../../assets/statistics.svg";
import { ReactComponent as UserIcon } from "../../assets/user.svg";
import { ReactComponent as LoginIcon } from "../../assets/login.svg";

import NavButton from "./NavButton";

type NavBarProps = {
  toggleAuth: () => void;
  toggleAdmin: () => void;
};

const StyledNavBar = styled.div`
  display: flex;
`;

const NavBar: React.FC<NavBarProps> = ({ toggleAdmin, toggleAuth }) => {
  const { user } = useAuthContext();

  const defaultNavBtns = useMemo(
    () => [
      {
        id: 0,
        name: "Practice",
        icon: <PractiseIcon />,
        path: "/practice"
      },
      {
        id: 1,
        name: "History",
        icon: <HistoryIcon />,
        path: user ? `/history/${user.username}` : "/history"
      },
      {
        id: 2,
        name: "Rankings",
        icon: <RankingsIcon />,
        path: "/rankings"
      }
    ],
    [user]
  );

  const navBtns: {
    id: number;
    name: string;
    icon: React.ReactElement;
    path?: string;
    onClick?: () => void;
  }[] = useMemo(() => {
    return user
      ? [
          ...defaultNavBtns,
          {
            id: 3,
            name: "User",
            icon: <UserIcon />,
            onClick: toggleAdmin
          }
        ]
      : [
          ...defaultNavBtns,
          {
            id: 3,
            name: "Login/Register",
            icon: <LoginIcon />,
            onClick: toggleAuth
          }
        ];
  }, [user, defaultNavBtns, toggleAdmin, toggleAuth]);

  return (
    <StyledNavBar>
      {navBtns.map(b => (
        <NavButton
          key={b.id}
          name={b.name}
          icon={b.icon}
          path={b.path}
          onClick={b.onClick}
        />
      ))}
    </StyledNavBar>
  );
};

export default NavBar;
