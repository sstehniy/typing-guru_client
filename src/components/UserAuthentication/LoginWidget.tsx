import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import Input from "../Shared/Input";
import Label from "../Shared/Label";
import Title from "../Shared/Title";
import { Button } from "../Shared/Button";
import ErrorMessage from "./ErrorMessage";
import { ReactComponent as VisibleIcon } from "../../assets/pw_visisble.svg";
import { ReactComponent as HiddenIcon } from "../../assets/pw_hidden.svg";

enum InputType {
  USERNAME = "username",
  PASSWORD = "password",
}

const StyledLoginWidget = styled.form`
  width: 100%;
  padding: 15px;
`;

const InputWrapper = styled.div`
  position: relative;
  overflow: visible;
  width: 100%;
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

type FormTypes = {
  username: string;
  password: string;
};

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

const LoginWidget: React.FC<{
  toggleCurrentView: () => void;
  handleLogin: (username: string, password: string) => Promise<void>;
}> = ({ toggleCurrentView, handleLogin }) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { handleSubmit, register, errors, setError } = useForm<FormTypes>({
    criteriaMode: "all",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case InputType.USERNAME:
        setUsernameInput(e.target.value);
        break;
      case InputType.PASSWORD:
        setPasswordInput(e.target.value);
        break;
      default:
        return;
    }
  };

  const loginUser = async () => {
    try {
      await handleLogin(usernameInput, passwordInput);
    } catch (error) {
      if (error.data) console.log(error.data);
    }
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    width: 20,
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
  };

  return (
    <StyledLoginWidget onSubmit={handleSubmit(loginUser)}>
      <Title>Login</Title>
      <Label>{InputType.USERNAME}</Label>
      <InputWrapper>
        <Input
          type="text"
          ref={register({
            required: "required field",
          })}
          name={InputType.USERNAME}
          defaultValue={usernameInput}
          onChange={handleInputChange}
          placeholder="johnyb04"
        />
        {errors[InputType.USERNAME]?.types?.required && (
          <ErrorMessage text="required field" />
        )}
      </InputWrapper>
      <Label>{InputType.PASSWORD}</Label>
      <InputWrapper>
        <Input
          type={passwordVisible ? "text" : "password"}
          ref={register({
            required: "required field",
          })}
          name={InputType.PASSWORD}
          defaultValue={passwordInput}
          onChange={handleInputChange}
          placeholder="********"
        />

        {passwordVisible ? (
          <VisibleIcon onClick={() => setPasswordVisible(false)} style={iconStyle} />
        ) : (
          <HiddenIcon onClick={() => setPasswordVisible(true)} style={iconStyle} />
        )}
        {errors[InputType.PASSWORD]?.types?.required && (
          <ErrorMessage text="required field" />
        )}
      </InputWrapper>

      <FormFooter>
        <FooterButton
          onClick={e => {
            e.preventDefault();
            toggleCurrentView();
          }}
        >
          Register
        </FooterButton>
        <FooterButton primary>Submit</FooterButton>
      </FormFooter>
    </StyledLoginWidget>
  );
};

export default LoginWidget;
