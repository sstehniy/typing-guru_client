import { apiClient } from "./protectedApiClient";
import axios from "axios";

export const registerUserService = async creds => {
  try {
    const response = await axios.post("/api/register", creds);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUserService = async creds => {
  try {
    const response = await axios.post("/api/login", creds);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUser = async id => {
  const response = await axios.get(`/api/user/${id}`);
  return response.data;
};

export const resendVerificationEmail = async userId => {
  try {
    await axios.post(`/api/user/${userId}/resend-verification`);
  } catch (error) {
    throw error;
  }
};

export const fetchUsersByUsername = async (usernamePattern, userId) => {
  try {
    const response = await apiClient.get(
      `/api/user/${userId}/search?username=${usernamePattern}`
    );
    return response.data;
  } catch (error) {
    console.log(error, "while fetching users");
  }
};
