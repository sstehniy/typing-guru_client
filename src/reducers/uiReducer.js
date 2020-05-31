const SET_NOTIFICATION = "SET_NOTIFICATION";
const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";

const initState = {
  notifications: [],
};

export const uiReducer = (state = initState, { type, data }) => {
  switch (type) {
    case SET_NOTIFICATION:
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
    case REMOVE_NOTIFICATION:
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

export const setNotification = ({ header, body, id }) => {
  return {
    type: SET_NOTIFICATION,
    data: { header, body, id },
  };
};

export const removeNotification = id => {
  return {
    type: REMOVE_NOTIFICATION,
    data: { id },
  };
};
