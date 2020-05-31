import React from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Backdrop = ({ children, onClick = () => {} }) => {
  return createPortal(
    <StyledBackdrop onClick={onClick}>{children}</StyledBackdrop>,
    document.getElementById("backdrop")
  );
};

Backdrop.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default Backdrop;
