import React from "react";
import styled from "styled-components";
import { ReactComponent as LogoSVG } from "../../assets/typewriter.svg";

const StyledLogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.p`
  font-size: 1.7rem;
  margin-left: 10px;
  color: ${({ theme }) => theme.black};
  font-family: "Recursive", sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
`;

const LogoWrapper = () => (
  <StyledLogoWrapper>
    <LogoSVG style={{ width: "47px" }} />
    <LogoText>Typing Guru</LogoText>
  </StyledLogoWrapper>
);

export default LogoWrapper;
