/* eslint-disable no-useless-catch */
import React, { createContext, useState, useContext, useEffect } from "react";
import { registerUserApi } from "../api/registerUserApi";
import { loginUserApi } from "../api/loginUserApi";
import { setAuthToken } from "../api/axiosInstance";

export interface IUser {
  fullName: string;
  username: string;
  password: string;
  email: string;
  token: string;
  id: string;
}

export type LoginData = Pick<IUser, "username" | "password">;

export type RegisterData = Omit<IUser, "token" | "id">;

export type ContextType = {
  user: Omit<IUser, "password"> | null;
  registerUser: (registerData: RegisterData) => void;
  loginUser: (loginData: LoginData) => void;
  logoutUser: () => void;
};

const defaultValue = {
  user: null,
  registerUser: () => {},
  loginUser: () => {},
  logoutUser: () => {},
};

export const UserContext = createContext<ContextType>(defaultValue);

export const useAuthContext = () => useContext(UserContext);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<Omit<IUser, "password"> | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("Typing-Guru");
    if (loggedInUser) {
      const { token, ...userData } = JSON.parse(loggedInUser);
      setUser(userData);
      setAuthToken(token);
    }
  }, []);

  const loginUser = async (loginData: LoginData) => {
    try {
      const loggedInUser = await loginUserApi(loginData);
      const { token, ...userData } = loggedInUser;
      setUser(userData);
      setAuthToken(token);
      localStorage.setItem("Typing-Guru", JSON.stringify({ token, ...userData }));
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (registerData: RegisterData) => {
    try {
      const regesteredUser = await registerUserApi(registerData);
      return regesteredUser;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("Typing-Guru");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthProvider;
