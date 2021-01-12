/* eslint-disable no-useless-catch */
import { service as axios } from "./axiosInstance";

export const registerUserApi = async (creds: {
  fullName: string;
  username: string;
  password: string;
  email: string;
}) => {
  try {
    const registeredUser = await axios.post("/api/register", { data: creds });
    return registeredUser.data;
  } catch (error) {
    throw error.response ? error.response : error;
  }
};
