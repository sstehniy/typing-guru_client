import {
  fetchInvitationsService,
  sendInvitationService,
  acceptInvitationService,
  cancelInvitationService,
  declineInvitationService,
} from "../sevices/invitationService";

import { setNotification } from "./uiReducer";
import {
  initFolders,
  setFoldersLoading,
  resetFoldersLoading,
  setFolderAfterAccepting,
} from "./collectionReducer";

const SET_INVITATIONS_LOADING = "SET_INVITATIONS_LOADING";
const RESET_INVITATIONS_LOADING = "RESET_INVITATIONS_LOADING";
const INIT_INVITATIONS = "INIT_INVITATIONS";
const SEND_INVITATION = "SEND_INVITATION";
const ACCEPT_INVITATION = "ACCEPT_INVITATION";
const CANCEL_INVITATION = "CANCEL_INVITATION";
const DECLINE_INVITATION = "DECLINE_INVITATION";

const initState = {
  isLoading: false,
  received: [],
  sent: [],
};

export const invitationReducer = (state = initState, { type, data }) => {
  switch (type) {
    case SET_INVITATIONS_LOADING:
      return { ...state, isLoading: true };
    case RESET_INVITATIONS_LOADING:
      return { ...state, isLoading: false };
    case INIT_INVITATIONS:
      return { ...state, received: data.received, sent: data.sent };
    case ACCEPT_INVITATION:
      return { state };

    default:
      return state;
  }
};

export const setInvitationsLoading = () => ({ type: SET_INVITATIONS_LOADING });

export const resetInvitationsLoading = () => ({
  type: RESET_INVITATIONS_LOADING,
});

export const fetchInvitations = userId => async dispatch => {
  const invitations = await fetchInvitationsService(userId);
  dispatch({ type: INIT_INVITATIONS, data: invitations });
};

export const acceptInvitation = id => {
  return async dispatch => {
    dispatch(setFoldersLoading());
    const folder = await acceptInvitationService(id);

    dispatch({ type: ACCEPT_INVITATION });
    dispatch(setFolderAfterAccepting(folder));
    dispatch(resetFoldersLoading());
    dispatch(setNotification({ header: "ha", body: "jksbfa" }));
  };
};

//   await acceptInvitationService(invId);

// } catch (error) {
//   console.log("accaption", error);
// }
// dispatch(setFoldersLoading());
// await dispatch(initFolders(user.id));
// dispatch(resetFoldersLoading());
// dispatch(
//   setNotification({
//     header: "Success!!!",
//     body: `You can now edit the folder with your friend`,
//     id: "kkk",
//   })
// );
