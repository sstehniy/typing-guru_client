import React, { useState, useEffect, useMemo } from "react";
import { registerUserService } from "../../sevices/userService";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { useForm, FormContext } from "react-hook-form";
import FormWrapper from "../Shared/Form/FormWrapper";
import InfoMessage from "../Shared/UI/InfoMessage";

import { getParentRoutePath } from "../../utils/getParentRoutePath";

const { Title, SubTitle, Form, Input, Button, Footer } = FormWrapper;

const pwStrengthRegex = {
  medium: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
  strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*+])(?=.{8,})/,
};

const pwStrengthTypes = {
  POOR: "poor",
  MEDIUM: "medium",
  STRONG: "strong",
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsernmae] = useState("");
  // * Password related local state
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordStrengthMessage, setPasswordStrengthMessage] = useState("");
  const [passwordClassName, setPasswordClassName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const match = useRouteMatch();
  const history = useHistory();
  const parentRoute = getParentRoutePath(match.path);

  const {
    errors,
    register,
    handleSubmit,
    watch,
    triggerValidation,
    setError,
  } = useForm();

  useEffect(() => {
    if (!password) {
      setPasswordStrength(null);
      setPasswordStrengthMessage("");
      return;
    }

    const validatePassword = async () => {
      await new Promise((resolve, _) => {
        if (password.match(pwStrengthRegex.strong)) {
          setPasswordStrength(pwStrengthTypes.STRONG);
          setPasswordStrengthMessage("Strong password");
          resolve();
        } else if (password.match(pwStrengthRegex.medium)) {
          setPasswordStrength(pwStrengthTypes.MEDIUM);
          setPasswordStrengthMessage("Medium password");
          resolve();
        } else {
          setPasswordStrength(pwStrengthTypes.POOR);
          setPasswordStrengthMessage("Weak Password");
          resolve();
        }
      });
      triggerValidation("password");
    };
    validatePassword();
  }, [password, triggerValidation]);

  const passwordStrengthMessageStyle = useMemo(() => {
    switch (passwordStrength) {
      case pwStrengthTypes.POOR:
        return {
          color: "#EF5B5B",
        };
      case pwStrengthTypes.MEDIUM:
        return {
          color: "#4D9DE0",
        };
      case pwStrengthTypes.STRONG:
        return {
          color: "#68A357",
        };
      default:
        return {};
    }
  }, [passwordStrength]);

  useEffect(() => {
    if (!passwordStrength) setPasswordStrengthMessage("");
  }, [passwordStrength]);

  useEffect(() => {
    if (!passwordStrength) return;
    if (!password && !errors.password) return setPasswordClassName("");
    switch (passwordStrength) {
      case pwStrengthTypes.POOR:
        return setPasswordClassName("pw__poor");
      case pwStrengthTypes.MEDIUM:
        return setPasswordClassName("pw__medium");
      case pwStrengthTypes.STRONG:
        return setPasswordClassName("pw__strong");
    }
  }, [passwordStrength, password, errors.password]);

  const inputChangeHandler = e => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        return setName(value);
      case "email":
        return setEmail(value);
      case "username":
        return setUsernmae(value);
      case "password":
        return setPassword(value);
      case "repeatPassword":
        return setRepeatPassword(value);
      default:
        return;
    }
  };

  const registerSubmitHandler = async () => {
    setIsSubmitting(true);
    if (!passwordStrength === pwStrengthTypes.STRONG) return;
    const formatedName = name.toLowerCase();
    const credentials = {
      name: formatedName,
      email,
      username,
      password,
    };

    try {
      const user = await registerUserService(credentials);
      console.log(user);
      history.push(`${parentRoute}/registration-success/${user.id}`);
    } catch (error) {
      if (!error.data) return console.error(error);
      Object.keys(error.data).map(key =>
        setError(key, `notUnique`, `This ${key} is already registered`)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <Title>Create an Account</Title>
      <SubTitle>
        Join Plan-It-Make-It to manage your todos and share them with your
        friends
      </SubTitle>
      <FormContext errors={errors} isLoading={isSubmitting}>
        <Form
          onSubmit={handleSubmit(registerSubmitHandler)}
          style={{ minHeight: "405px" }}
        >
          <div style={{ position: "relative" }}>
            <Input
              name="name"
              type="text"
              defaultValue={name}
              onChange={inputChangeHandler}
              autoFocus
              capitalize
              ref={register({
                pattern: { value: /^[a-z ,.'-]+$/i },
                required: "Required field",
              })}
            />
            <Input
              name="email"
              type="text"
              defaultValue={email}
              onChange={inputChangeHandler}
              ref={register({
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/gim,
                  message: "Email must be valid!",
                },
                required: "Required field",
              })}
            />
            <Input
              name="username"
              type="text"
              defaultValue={username}
              onChange={inputChangeHandler}
              ref={register({
                pattern: {
                  value: /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/,
                  message:
                    "Username must match the pattern(First character alphanum, then 6 to 18 characters, last character alphanum)",
                },
                required: "Required field",
              })}
              autoComplete="new-password"
            />
            <Input
              name="password"
              type="password"
              defaultValue={password}
              onChange={inputChangeHandler}
              className={passwordClassName}
              ref={register({
                required: "Required field",
              })}
              autoComplete="new-password"
            />
            {passwordStrengthMessage && !isSubmitting && (
              <InfoMessage type="normal" style={passwordStrengthMessageStyle}>
                {passwordStrengthMessage}
              </InfoMessage>
            )}
            <Input
              name="repeat_password"
              type="password"
              defaultValue={repeatPassword}
              onChange={inputChangeHandler}
              ref={register({
                validate: p =>
                  p === watch("password") || "Passwords don't match",
              })}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit">Register</Button>
        </Form>
      </FormContext>
      <Footer>
        <p>
          Have an account? <Link to={`${parentRoute}/login`}>Login</Link>
        </p>
      </Footer>
    </FormWrapper>
  );
};

export default Register;
