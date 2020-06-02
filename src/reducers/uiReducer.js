import { v4 } from "uuid";
import types from "./actionTypes";

const initState = {
  notifications: [],
};

export const uiReducer = (state = initState, { type, data }) => {
  switch (type) {
    case types.SET_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            header: data.header,
            body: data.body,
            id: data.id,
          },
        ],
      };
    case types.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications.filter(
            notification => notification.id !== data.id
          ),
        ],
      };
    default:
      return state;
  }
};

export const setNotification = ({ header, body }) => {
  return {
    type: types.SET_NOTIFICATION,
    data: { header, body, id: v4() },
  };
};

export const removeNotification = id => {
  return {
    type: types.REMOVE_NOTIFICATION,
    data: { id },
  };
};
