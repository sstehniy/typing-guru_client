import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { ThemeProvider } from "styled-components";
import { useForm, FormContext } from "react-hook-form";

//* Components Import
import Title from "./components/FormTitle";
import SubTitle from "./components/FormSubTitle";
import Form from "./components/FormBody";
import Input from "./components/FormInput";
import Button from "./components/FormButton";
import Footer from "./components/FormFooter";

const StyledFormWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 30px 60px;
  width: 500px;
  background-color: ${({ theme }) => theme.colors.yellow};
  border-radius: 2px;
  box-shadow: 9px 8px 1px ${({ theme }) => theme.colors.jet};

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 3px 3px 4.4px rgba(0, 0, 0, 0.036),
      3px 3px 8.5px rgba(0, 0, 0, 0.052), 3px 3px 12.2px rgba(0, 0, 0, 0.065),
      3px 3px 15.8px rgba(0, 0, 0, 0.075), 3px 3px 19.4px rgba(0, 0, 0, 0.085),
      3px 3px 23.5px rgba(0, 0, 0, 0.095), 3px 3px 29px rgba(0, 0, 0, 0.108),
      3px 3px 38.4px rgba(0, 0, 0, 0.124), 3px 3px 63px rgba(0, 0, 0, 0.16);
  }

  & * {
    text-transform: uppercase;
  }
`;

const FormWrapper = ({ children }) => {
  return <StyledFormWrapper>{children}</StyledFormWrapper>;
};

FormWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

FormWrapper.Title = Title;
FormWrapper.SubTitle = SubTitle;
FormWrapper.Form = Form;
FormWrapper.Input = Input;
FormWrapper.Button = Button;
FormWrapper.Footer = Footer;

export default FormWrapper;
