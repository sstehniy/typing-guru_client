import { v4 } from "uuid";
import {
  fetchFolders,
  deleteFolder,
  editFolderTitle,
  createFolderService,
} from "../sevices/collectionService";

import { setNotification } from "../reducers/uiReducer";

import types from "./actionTypes";

const initState = {
  foldersLoading: false,
  creatingFolder: false,
  currFolderId: null,
  currFilter: "all",
  folders: [],
};

export const collectionReducer = (state = initState, { type, data }) => {
  switch (type) {
    case types.SET_CURR_FOLDER_ID:
      return {
        ...state,
        currFolderId: data.id,
      };
    case types.SET_FOLDERS:
      return { ...state, folders: data.folders };
    case types.CREATE_FOLDER:
      return {
        ...state,
        folders: [...state.folders, data.folder],
      };
    case types.SET_CREATING_FOLDER:
      return { ...state, creatingFolder: true };
    case types.RESET_CREATING_FOLDER:
      return { ...state, creatingFolder: false };
    case types.REMOVE_FOLDER:
      return {
        ...state,
        folders: [...state.folders.filter(folder => folder.id !== data.id)],
      };
    case types.CREATE_TODO:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === state.currFolderId
            ? {
                ...folder,
                todos: [
                  {
                    title: data.title,
                    description: data.description,
                    id: v4(),
                    checked: false,
                  },
                  ...folder.todos,
                ],
              }
            : folder
        ),
      };
    case types.TOGGLE_TODO:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === state.currFolderId
            ? {
                ...folder,
                todos: folder.todos.map(todo =>
                  todo.id === data.id
                    ? { ...todo, checked: !todo.checked }
                    : todo
                ),
              }
            : folder
        ),
      };
    case types.REMOVE_TODO:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === state.currFolderId
            ? {
                ...folder,
                todos: folder.todos.filter(todo => todo.id !== data.id),
              }
            : folder
        ),
      };
    case types.EDIT_FOLDER:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === data.id ? { ...folder, title: data.title } : folder
        ),
      };
    case types.SET_FILTER:
      return {
        ...state,
        currFilter: data.filter,
      };
    case types.RESET_FILTER:
      return {
        ...state,
        currFilter: "all",
      };
    case types.REFRESH_TODOS_AFTER_DROP:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === state.currFolderId
            ? { ...folder, todos: [...data.newTodos] }
            : folder
        ),
      };
    case types.SET_FOLDERS_LOADING:
      return { ...state, foldersLoading: true };
    case types.RESET_FOLDERS_LOADING:
      return { ...state, foldersLoading: false };
    case types.SET_FOLDER_AFTER_ACCEPTING:
      return { ...state, folders: [{ ...data.folder }, ...state.folders] };
    case types.REFRESH_FOLDER:
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === data.folder.id ? data.folder : f
        ),
      };
    default:
      return state;
  }
};

export const createFolder = () => {
  return async dispatch => {
    dispatch({ type: types.SET_CREATING_FOLDER });
    try {
      const folder = await createFolderService({
        title: "New Folder",
        id: v4(),
        shared: false,
        todos: [],
      });
      dispatch({
        type: types.CREATE_FOLDER,
        data: { folder },
      });
    } catch (error) {
      dispatch(
        setNotification({
          header: "Error",
          body: "Error while creating folder",
        })
      );
    } finally {
      dispatch({ type: types.RESET_CREATING_FOLDER });
    }
  };
};

export const removeFolder = id => {
  return async dispatch => {
    await deleteFolder(id);
    dispatch({
      type: types.REMOVE_FOLDER,
      data: { id },
    });
  };
};

export const setCurrFolderId = id => ({
  type: types.SET_CURR_FOLDER_ID,
  data: { id },
});

export const editFolder = (folderId, newTitle) => {
  return async dispatch => {
    const newFolder = await editFolderTitle(folderId, newTitle);
    const { id, title } = newFolder;
    dispatch({
      type: types.EDIT_FOLDER,
      data: { id, title },
    });
  };
};

export const createTodo = (title, description) => ({
  type: types.CREATE_TODO,
  data: {
    title,
    description,
  },
});

export const toggleTodo = id => ({
  type: types.TOGGLE_TODO,
  data: { id },
});

export const removeTodo = id => ({
  type: types.REMOVE_TODO,
  data: { id },
});

export const refreshTodosAfterDrop = newTodos => ({
  type: types.REFRESH_TODOS_AFTER_DROP,
  data: { newTodos },
});

export const initFolders = id => {
  return async dispatch => {
    try {
      const folders = await fetchFolders(id);
      dispatch({
        type: types.SET_FOLDERS,
        data: { folders },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFilter = filter => ({
  type: types.SET_FILTER,
  data: { filter },
});

export const resetFilter = () => ({
  type: types.RESET_FILTER,
});

export const setFoldersLoading = () => ({ type: types.SET_FOLDERS_LOADING });
export const resetFoldersLoading = () => ({
  type: types.RESET_FOLDERS_LOADING,
});
export const setFolderAfterAccepting = folder => ({
  type: types.SET_FOLDER_AFTER_ACCEPTING,
  data: { folder },
});

export const refreshSharedFolder = folder => ({
  type: types.REFRESH_FOLDER,
  data: { folder },
});

export const refreshFolders = () => {
  return async (dispatch, getState) => {
    dispatch(setCurrFolderId(null));
    dispatch(setFoldersLoading());
    const userId = getState().user.data.id;
    const folders = await fetchFolders(userId);
    dispatch({ type: types.SET_FOLDERS, data: { folders } });
    dispatch(resetFoldersLoading());
  };
};
