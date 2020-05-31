import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const StyledFormBody = styled.form`
  & div:first-of-type {
    margin-top: 0;
  }

  & div:last-of-type {
    margin-bottom: 0;
  }

  margin-top: 30px;
`;
const FormBody = ({ children, onSubmit, ...props }) => {
  return (
    <StyledFormBody onSubmit={onSubmit} {...props}>
      {children}
    </StyledFormBody>
  );
};

FormBody.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onSubmit: PropTypes.func.isRequired,
  props: PropTypes.any,
};

export default FormBody;
