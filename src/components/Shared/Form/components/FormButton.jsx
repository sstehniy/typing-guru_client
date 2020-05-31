import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import styled, { css } from "styled-components";

const StyledFormButton = styled.button`
  position: relative;
  width: 150px;
  height: 35px;
  left: 50%;
  font-size: 1rem;
  font-weight: 700;
  background-color: transparent;
  transform: translateX(-50%);
  margin: 20px 0;
  outline: none;
  border: 2px solid ${({ theme }) => theme.colors.jet};
  box-shadow: 3px 3px 1px ${({ theme }) => theme.colors.jet};
  letter-spacing: 0.7px;
  transition: all 0.15s ease;
  ${({ isLoading }) =>
    isLoading
      ? css`
          pointer-events: none;
        `
      : null}

  &:hover {
    background-color: ${({ theme }) => theme.colors.jet};
    color: ${({ theme }) => theme.colors.yellow};
    cursor: pointer;
    box-shadow: 0 0 0 black;
  }
`;
const FormButton = ({
  children: text = "Submit",
  type = "submit",
  onClick = () => {},
}) => {
  const { isLoading } = useFormContext();
  return (
    <StyledFormButton type={type} onClick={onClick} isLoading={isLoading}>
      {isLoading ? "Loaing..." : text}
    </StyledFormButton>
  );
};

FormButton.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default FormButton;
