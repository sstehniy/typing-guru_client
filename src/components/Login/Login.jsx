import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../reducers/userReducer";
import { Link, useHistory } from "react-router-dom";
import { useForm, FormContext } from "react-hook-form";
import FormWrapper from "../Shared/Form/FormWrapper";
import InfoMessage from "../Shared/UI/InfoMessage";

const { Title, SubTitle, Form, Input, Button, Footer } = FormWrapper;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { register, errors, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const history = useHistory();

  const loginHandler = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(loginUser({ username, password }));
      history.push(`/${username}/home`);
    } catch (error) {
      console.log(error);
      setLoginError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputChangeHandler = ({ target }) => {
    if (loginError) setLoginError(false);
    switch (target.name) {
      case "username":
        return setUsername(target.value);
      case "password":
        return setPassword(target.value);
    }
  };

  return (
    <FormWrapper>
      <Title>Log into your account</Title>
      <SubTitle>
        Log into your account to get access to your todos collections
      </SubTitle>
      <FormContext errors={errors} isLoading={isSubmitting}>
        <Form onSubmit={handleSubmit(loginHandler)}>
          <Input
            name="username"
            type="text"
            defaultValue={username}
            onChange={inputChangeHandler}
            ref={register({
              required: "Required Field",
            })}
          />
          <Input
            name="password"
            type="password"
            defaultValue={password}
            onChange={inputChangeHandler}
            ref={register({
              required: "Required Field",
            })}
          />
          {loginError && (
            <InfoMessage type="error">
              Either username or password you entered are invalid
            </InfoMessage>
          )}
          <Button type="submit">Login</Button>
        </Form>
        <Footer>
          <p>
            Don&apos;t have an account?
            <Link to={`/welcome/register`}>Register</Link>
          </p>
        </Footer>
      </FormContext>
    </FormWrapper>
  );
};

export default Login;
