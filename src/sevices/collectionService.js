import { apiClient } from "./protectedApiClient";

export const fetchFolders = async id => {
  try {
    console.log("hi from fetch folders");
    const response = await apiClient.get(`/api/user/${id}/folders`);
    console.log("hi from fetch end");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const patchTodosByFolderId = async (id, todos) => {
  try {
    const response = await apiClient.patch(`/api/folders/${id}`, {
      todos,
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const createFolderService = async body => {
  try {
    console.log(body);
    const response = await apiClient.post(`/api/folders`, body);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteFolder = async id => {
  try {
    await apiClient.delete(`/api/folders/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const editFolderTitle = async (id, title) => {
  try {
    const response = await apiClient.patch(`/api/folders/${id}`, {
      title,
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const autoRefreshFolder = async id => {
  try {
    const response = await apiClient.get(`/api/folders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
