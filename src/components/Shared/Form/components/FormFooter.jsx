import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const StyledFormFooter = styled.div`
  text-align: center;
`;
const FormFooter = ({ children }) => {
  return <StyledFormFooter>{children}</StyledFormFooter>;
};

FormFooter.propTypes = {
  children: PropTypes.node,
};

export default FormFooter;
