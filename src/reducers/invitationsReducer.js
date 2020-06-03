import {
  fetchInvitationsService,
  sendInvitationService,
  acceptInvitationService,
  cancelInvitationService,
  declineInvitationService,
} from "../services/invitationService";

import { setNotification } from "./uiReducer";
import {
  initFolders,
  setFoldersLoading,
  resetFoldersLoading,
  setFolderAfterAccepting,
} from "./collectionReducer";

import types from "./actionTypes";

const initState = {
  isLoading: false,
  received: [],
  sent: [],
};

export const invitationReducer = (state = initState, { type, data }) => {
  switch (type) {
    case types.SET_INVITATIONS_LOADING:
      return { ...state, isLoading: true };
    case types.RESET_INVITATIONS_LOADING:
      return { ...state, isLoading: false };
    case types.INIT_INVITATIONS:
      return { ...state, received: data.received, sent: data.sent };
    case types.ACCEPT_INVITATION:
      return { state };

    default:
      return state;
  }
};

export const setInvitationsLoading = () => ({
  type: types.SET_INVITATIONS_LOADING,
});

export const resetInvitationsLoading = () => ({
  type: types.RESET_INVITATIONS_LOADING,
});

export const fetchInvitations = userId => async dispatch => {
  const invitations = await fetchInvitationsService(userId);
  dispatch({ type: types.INIT_INVITATIONS, data: invitations });
};

export const acceptInvitation = id => {
  return async dispatch => {
    dispatch(setFoldersLoading());
    const folder = await acceptInvitationService(id);
    dispatch({ type: types.ACCEPT_INVITATION });
    dispatch(setFolderAfterAccepting(folder));
    dispatch(resetFoldersLoading());
    dispatch(
      setNotification({
        header: "Congratulation",
        body: "You successfully added a new shared todo to your library",
      })
    );
  };
};
