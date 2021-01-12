import React from "react";
import styled from "styled-components";

const StyledTitle = styled.h3`
  margin-bottom: 7px;
`;

const Title: React.FC<{ children: string }> = ({ children: value }) => {
  return <StyledTitle>{value}</StyledTitle>;
};

export default Title;
