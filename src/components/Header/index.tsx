import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import LogoWrapper from "./LogoWrapper";
import NavBar from "./NavBar";
import UserAuthentication from "../UserAuthentication";
import { useAuthContext } from "../../context/userContext";
import UserAdmin from "../UserAdministartion";

const StyledHeader = styled.header`
  position: relative;
  height: 66px;
  background-color: ${({ theme }) => theme.blue};
  box-shadow: ${({ theme }) => theme.box_shadow_lg};
  padding: 0 calc(20px + 0.5vw);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
`;

const Header: React.FC = () => {
  const [showUserAuth, setShowUserAuth] = useState({ show: false, locked: false });
  const [showUserAdmin, setShowUserAdmin] = useState({ show: false, locked: false });
  const { user } = useAuthContext();
  const navBarRef = useRef<HTMLHeadElement>(null);

  useEffect(() => {
    if (user) {
      setShowUserAuth({ show: false, locked: true });
      setShowUserAdmin({ show: false, locked: false });
    } else {
      setShowUserAdmin({ show: false, locked: true });
      setShowUserAuth({ show: false, locked: false });
    }
  }, [user]);

  const toggleShowUserAuth = () => {
    if (!showUserAuth.locked) {
      setShowUserAuth({ ...showUserAuth, show: !showUserAuth.show });
    }
  };

  const toggleShowUserAdmin = () => {
    if (!showUserAdmin.locked) {
      setShowUserAdmin({ ...showUserAdmin, show: !showUserAdmin.show });
    }
  };

  return (
    <StyledHeader ref={navBarRef}>
      <LogoWrapper />
      <NavBar toggleAuth={toggleShowUserAuth} toggleAdmin={toggleShowUserAdmin} />
      {!!(showUserAuth.show && !showUserAuth.locked) && (
        <UserAuthentication
          handleClickOutside={toggleShowUserAuth}
          navBarRef={navBarRef}
          close={() => {
            setShowUserAuth({ ...showUserAuth, show: false });
          }}
        />
      )}
      {!!(showUserAdmin.show && !showUserAdmin.locked) && (
        <UserAdmin
          handleClickOutside={toggleShowUserAdmin}
          navBarRef={navBarRef}
          close={() => {
            setShowUserAdmin({ ...showUserAdmin, show: false });
          }}
        />
      )}
    </StyledHeader>
  );
};

export default Header;
