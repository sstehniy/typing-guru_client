import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const StyledFormSubTitle = styled.p`
  margin-top: 15px;
  text-align: center;
`;
const FormSubTitle = ({ children = "Form Subtitle" }) => {
  return <StyledFormSubTitle>{children}</StyledFormSubTitle>;
};

FormSubTitle.propTypes = {
  children: PropTypes.string,
};

export default FormSubTitle;
