/* eslint-disable no-useless-catch */
import { service as axios } from "./axiosInstance";

export const loginUserApi = async (creds: { username: string; password: string }) => {
  try {
    const loggedInUser = await axios.post("/api/login", { data: creds });
    return loggedInUser.data;
  } catch (error) {
    throw error;
  }
};
