/* eslint-disable no-param-reassign */
import axios from "axios";

let token: string | null = null;

export const service = axios.create();

export const setAuthToken = (authToken: string | null) => {
  if (authToken) {
    token = `bearer ${authToken}`;
  } else {
    token = null;
  }
};

service.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = token;
  } else {
    config.headers.Authorization = "";
  }
  return config;
});
