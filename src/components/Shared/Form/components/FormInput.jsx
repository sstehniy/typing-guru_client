import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { CSSTransition } from "react-transition-group";

import { useFormContext } from "react-hook-form";
import InfoMessage from "../../UI/InfoMessage";

const StyledFormInput = styled.div`
  margin: 10px auto;

  & label {
    display: block;
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
  & .input__wrapper {
    position: relative;
    margin-top: 3px;
    & input {
      text-transform: ${({ capitalize }) =>
        capitalize ? "capitalize" : "none"};
      width: 100%;
      height: 30px;
      border: none;
      padding: 0 10px;
      outline: none;
      font-size: 0.9rem;
      box-shadow: 3.5px 3.5px 1px ${({ theme }) => theme.colors.jet};
      letter-spacing: 1px;
      border: 2px solid transparent;
      transition: all 0.3s ease;

      &:focus {
        background-color: ${({ theme }) => theme.colors.jet};
        border: 2px solid ${({ theme }) => theme.colors.black};
        color: ${({ theme }) => theme.colors.yellow};
        box-shadow: 0 0 0 black;
      }

      &.error,
      &.pw__poor {
        box-shadow: 3.5px 3.5px 1px ${({ theme }) => theme.colors.red};
      }
      &.pw__medium {
        box-shadow: 3.5px 3.5px 1px ${({ theme }) => theme.colors.blue};
      }
      &.pw__strong {
        box-shadow: 3.5px 3.5px 1px ${({ theme }) => theme.colors.lightGreen};
      }
    }

    @keyframes loadingWave {
      from {
        background-position: 0% 0%;
      }
      to {
        background-position: -135% 0%;
      }
    }

    ${({ isLoading }) =>
      isLoading
        ? css`
            & input {
              box-shadow: 0 0 0 black;
            }
            & span {
              position: absolute;
              top: 0px;
              left: 0px;
              right: 0px;
              bottom: 0px;
              background-image: linear-gradient(
                -90deg,
                rgba(0, 0, 0, 0.8) 0%,
                #6d6466 50%,
                rgba(0, 0, 0, 0.8) 100%
              );
              background-size: 400% 400%;
              animation: loadingWave 1s linear infinite;
            }
          `
        : null}
  }
`;
const FormInput = (
  {
    name,
    type = "text",
    defaultValue,
    onChange,
    customClassName = "",
    capitalize = false,
    ...props
  },
  ref
) => {
  const { errors, isLoading } = useFormContext();

  return (
    <StyledFormInput capitalize={capitalize} isLoading={isLoading}>
      <label htmlFor={name}>{name.split("_").join(" ").toUpperCase()}</label>
      <div className="input__wrapper">
        <input
          type={type}
          name={name}
          ref={ref}
          className={`${errors[name] ? "error" : ""}  ${customClassName}`}
          defaultValue={defaultValue}
          onChange={onChange}
          {...props}
        />
        <span></span>
      </div>
      {errors[name] && (
        <InfoMessage type="error">{errors[name].message}</InfoMessage>
      )}
    </StyledFormInput>
  );
};

const FormInputWrapper = React.forwardRef(FormInput);

FormInputWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  capitalize: PropTypes.bool,
  props: PropTypes.any,
};

export default FormInputWrapper;
