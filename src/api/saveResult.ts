/* eslint-disable no-useless-catch */
import { service as axios } from "./axiosInstance";

type Result = {
  wpm: number;
  cpm: number;
  acc: number;
  score: 1 | 2 | 3;
  username: string;
};

export const saveResult = async (data: Result) => {
  try {
    const savedTest = await axios.post("/api/tests", { data });
    return savedTest;
  } catch (error) {
    throw error;
  }
};
