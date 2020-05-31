import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const StyledFormTitle = styled.h1`
  text-align: center;
  letter-spacing: 0.8px;
`;
const FormTitle = ({ children = "Form Title" }) => {
  return <StyledFormTitle>{children}</StyledFormTitle>;
};

FormTitle.propTypes = {
  title: PropTypes.string,
};

export default FormTitle;
