import axios from "axios";

let token = null;

export const apiClient = axios.create();

export const setToken = newToken => {
  token = `bearer ${newToken}`;
};

apiClient.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
