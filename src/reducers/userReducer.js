import { loginUserService, fetchUser } from "../sevices/userService";
import { setToken } from "../sevices/protectedApiClient";
const SET_USER = "SET_USER";
const INIT_USER = "INIT_USER";
const INIT_USER_FAILED = "INIT_USER_FAILED";
const REMOVE_USER = "RESET_USER";

const initState = {
  isLoggedIn: false,
  data: {
    isVerified: false,
    username: "",
    token: "",
  },
};

export const userReducer = (state = initState, { type, data }) => {
  switch (type) {
    case SET_USER:
      return {
        ...state,
        isLoggedIn: true,
        data: {
          username: data.username,
          token: data.token,
          isVerified: data.isVerified,
          id: data.id,
        },
      };
    case INIT_USER:
      return {
        ...state,
        isLoggedIn: true,
        data: {
          username: data.username,
          token: data.token,
          isVerified: data.isVerified,
          id: data.id,
        },
      };
    case INIT_USER_FAILED:
      return state;
    case REMOVE_USER:
      return { ...state, isLoggedIn: false, user: {} };
    default:
      return state;
  }
};

export const loginUser = creds => {
  return async dispatch => {
    try {
      const user = await loginUserService(creds);
      localStorage.setItem("TODO_APP_USER", JSON.stringify(user));
      setToken(user.token);
      dispatch({
        type: SET_USER,
        data: { ...user },
      });
    } catch (error) {
      throw new Error("did not login");
    }
  };
};

export const removeUser = () => {
  localStorage.removeItem("TODO_APP_USER");
  return { type: REMOVE_USER };
};

export const initUser = () => {
  return async dispatch => {
    const data = localStorage.getItem("TODO_APP_USER");
    if (!data) return dispatch({ type: INIT_USER_FAILED });
    const parsedData = JSON.parse(data);
    dispatch({ type: INIT_USER, data: { ...parsedData } });
  };
};
