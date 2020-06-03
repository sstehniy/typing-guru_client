import { apiClient } from "./protectedApiClient";

export const fetchInvitationsService = async userId => {
  try {
    const response = await apiClient.get(`/api/user/${userId}/invitations`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const sendInvitationService = async (username, folderId) => {
  try {
    const response = await apiClient.post(`/api/invitation/`, {
      username,
      folderId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptInvitationService = async id => {
  try {
    console.log("hi from accept start");
    const response = await apiClient.post("/api/invitation/accept", { id });
    console.log("hi from accept end");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const declineInvitationService = async id => {
  try {
    const response = apiClient.post("/api/invitation/decline", { id });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const cancelInvitationService = async id => {
  try {
    const response = apiClient.post("/api/invitation/cancel", { id });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
