import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import Input from "../Shared/Input";
import Label from "../Shared/Label";
import Title from "../Shared/Title";
import { Button } from "../Shared/Button";
import ErrorMessage from "./ErrorMessage";

enum InputType {
  FULL_NAME = "full name",
  EMAIL = "email",
  USERNAME = "username",
  PASSWORD = "password",
}

const StyledRegisterWidget = styled.form`
  width: 100%;
  padding: 15px;
`;

const InputWrapper = styled.div`
  position: relative;
  overflow: visible;
  width: 100%;
  height: 30px;
  margin-top: 5px;
  margin-bottom: 25px;
  border-radius: 7px;
`;

const IconWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 25px;
  width: 25px;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 15px;
  background-color: transparent;

  &:hover {
    background-color: ${({ theme }) => theme.main_bg};
  }

  & svg {
    height: 80%;
    width: 80%;
  }
`;

const FormFooter = styled.div`
  width: 100%;
  padding: 5px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterButton = styled(Button)`
  margin: 0;
  ${({ primary }) =>
    primary &&
    css`
      border: none;
      background-color: ${({ theme }) => theme.green};
      color: ${({ theme }) => theme.black};
    `}
`;

type FormTypes = {
  "full name": string;
  email: string;
  username: string;
  password: string;
};

const RegisterWidget: React.FC<{
  toggleCurrentView: () => void;
  handleRegister: (creds: {
    fullName: string;
    username: string;
    password: string;
    email: string;
  }) => Promise<void>;
}> = ({ toggleCurrentView, handleRegister }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleSubmit, register, errors, setError } = useForm<FormTypes>({
    criteriaMode: "all",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case InputType.FULL_NAME:
        setFullName(value);
        break;
      case InputType.EMAIL:
        setEmail(value);
        break;
      case InputType.USERNAME:
        setUsername(value);
        break;
      case InputType.PASSWORD:
        setPassword(value);
        break;
      default:
        return;
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      await handleRegister({ fullName, username, email, password });
    } catch (error) {
      if (error.data) {
        Object.keys(error.data.data.errors).map(k =>
          setError(k as "email" | "username" | "password" | "full name", {
            type: "unique",
            message: `This ${k} is already registered`,
          })
        );
      }
    }
  };

  return (
    <StyledRegisterWidget onSubmit={handleSubmit(handleRegisterSubmit)}>
      <Title>Register</Title>
      <Label>{InputType.FULL_NAME}</Label>
      <InputWrapper>
        <Input
          type="text"
          placeholder="John Doe"
          defaultValue={fullName}
          onChange={handleInputChange}
          name={InputType.FULL_NAME}
          ref={register({
            required: "required field",
            pattern: {
              value: new RegExp("^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$"),
              message: "ivalid input",
            },
          })}
        />
        {errors[InputType.FULL_NAME]?.types?.required && (
          <ErrorMessage text="required field" />
        )}
        {errors[InputType.FULL_NAME]?.types?.pattern && (
          <ErrorMessage text="invalid input" />
        )}
      </InputWrapper>
      <Label>{InputType.EMAIL}</Label>
      <InputWrapper>
        <Input
          type="text"
          placeholder="johndoe@somemail.com"
          defaultValue={email}
          onChange={handleInputChange}
          name={InputType.EMAIL}
          ref={register({
            required: "required field",
            pattern: {
              value: new RegExp(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              ),
              message: "ivalid input",
            },
          })}
        />
        {errors[InputType.EMAIL]?.types?.required && (
          <ErrorMessage text="required field" />
        )}
        {errors[InputType.EMAIL]?.types?.pattern && <ErrorMessage text="invalid input" />}
        {errors.email?.type === "unique" && (
          <ErrorMessage text="This email is already registered" />
        )}
      </InputWrapper>
      <Label>{InputType.USERNAME}</Label>
      <InputWrapper>
        <Input
          type="text"
          placeholder="johnyboiii"
          defaultValue={username}
          onChange={handleInputChange}
          name={InputType.USERNAME}
          ref={register({
            required: "required",
            pattern: {
              value: new RegExp("^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$"),
              message: "ivalid input",
            },
          })}
        />
        {errors[InputType.USERNAME]?.types?.required && (
          <ErrorMessage text="required field" />
        )}
        {errors[InputType.USERNAME]?.types?.pattern && (
          <ErrorMessage text="invalid input" />
        )}
        {errors.username?.type === "unique" && (
          <ErrorMessage text="This username is already registered" />
        )}
      </InputWrapper>
      <Label>{InputType.PASSWORD}</Label>
      <InputWrapper>
        <Input
          type="password"
          placeholder="Somepw123+"
          defaultValue={password}
          onChange={handleInputChange}
          name={InputType.PASSWORD}
          ref={register({
            required: "required",
            pattern: {
              value: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
              message: "ivalid password",
            },
          })}
        />
        {errors[InputType.PASSWORD]?.types?.required && (
          <ErrorMessage text="required field" />
        )}
        {errors[InputType.PASSWORD]?.types?.pattern && (
          <ErrorMessage text="invalid input" />
        )}
      </InputWrapper>
      <FormFooter>
        <FooterButton
          onClick={e => {
            e.preventDefault();
            toggleCurrentView();
          }}
        >
          Login
        </FooterButton>
        <FooterButton primary onClick={handleRegisterSubmit}>
          Submit
        </FooterButton>
      </FormFooter>
    </StyledRegisterWidget>
  );
};

export default RegisterWidget;
