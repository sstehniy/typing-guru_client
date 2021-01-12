/* eslint-disable react/require-default-props */
import React from "react";
import styled from "styled-components";

type FormInputProps = {
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type: string;
  name?: string;
};

const StyledFormInput = styled.input`
  outline: none;
  width: 100%;
  height: 100%;
  padding: 7px;
  border: none;
  border-radius: 7px;
  background-color: rgb(230, 230, 230);
`;

const FormInput = React.forwardRef((props: FormInputProps, ref: any) => {
  return <StyledFormInput {...props} ref={ref} />;
});

export default FormInput;
