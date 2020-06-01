import { v4 } from "uuid";
import {
  fetchFolders,
  deleteFolder,
  editFolderTitle,
  createFolderService,
} from "../sevices/collectionService";

import { setNotification } from "../reducers/uiReducer";

const CREATE_FOLDER = "CREATE_FOLDER";
const EDIT_FOLDER = "EDIT_FOLDER";
const CREATE_TODO = "CREATE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const SET_FILTER = "SET_FILTER";
const RESET_FILTER = "RESET_FILTER";
const REFRESH_TODOS_AFTER_DROP = "REFRESH_TODOS_AFTER_DROP";
const REMOVE_FOLDER = "DELETE_FOLDER";
const SET_CURR_FOLDER_ID = "SET_CURR_FOLDER";
const SET_FOLDERS = "SET_FOLDERS";
const SET_FOLDERS_LOADING = "SET_FOLDERS_LOADING";
const RESET_FOLDERS_LOADING = "RESET_FOLDERS_LOADING";
const SET_FOLDER_AFTER_ACCEPTING = "SET_FOLDER_AFTER_ACCEPTING";
const REFRESH_FOLDER = "REFRESH_FOLDER";
const SET_CREATING_FOLDER = "SET_CREATING_FOLDER";
const RESET_CREATING_FOLDER = "RESET_CREATING_FOLDER";

// const SEND_INVITATION = "SEND_INVITATION";

const initState = {
  foldersLoading: false,
  creatingFolder: false,
  currFolderId: null,
  currFilter: "all",
  folders: [],
};

export const collectionReducer = (state = initState, { type, data }) => {
  switch (type) {
    case SET_CURR_FOLDER_ID:
      return {
        ...state,
        currFolderId: data.id,
      };
    case SET_FOLDERS:
      return { ...state, folders: data.folders };
    case CREATE_FOLDER:
      return {
        ...state,
        folders: [...state.folders, data.folder],
      };
    case SET_CREATING_FOLDER:
      return { ...state, creatingFolder: true };
    case RESET_CREATING_FOLDER:
      return { ...state, creatingFolder: false };
    case REMOVE_FOLDER:
      return {
        ...state,
        folders: [...state.folders.filter(folder => folder.id !== data.id)],
      };
    case CREATE_TODO:
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
    case TOGGLE_TODO:
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
    case REMOVE_TODO:
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
    case EDIT_FOLDER:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === data.id ? { ...folder, title: data.title } : folder
        ),
      };
    case SET_FILTER:
      return {
        ...state,
        currFilter: data.filter,
      };
    case RESET_FILTER:
      return {
        ...state,
        currFilter: "all",
      };
    case REFRESH_TODOS_AFTER_DROP:
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === state.currFolderId
            ? { ...folder, todos: [...data.newTodos] }
            : folder
        ),
      };
    case SET_FOLDERS_LOADING:
      return { ...state, foldersLoading: true };
    case RESET_FOLDERS_LOADING:
      return { ...state, foldersLoading: false };
    case SET_FOLDER_AFTER_ACCEPTING:
      return { ...state, folders: [{ ...data.folder }, ...state.folders] };
    case REFRESH_FOLDER:
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
    dispatch({ type: SET_CREATING_FOLDER });
    try {
      const folder = await createFolderService({
        title: "New Folder",
        id: v4(),
        shared: false,
        todos: [],
      });
      dispatch({
        type: CREATE_FOLDER,
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
      dispatch({ type: RESET_CREATING_FOLDER });
    }
  };
};

export const removeFolder = id => {
  return async dispatch => {
    await deleteFolder(id);
    dispatch({
      type: REMOVE_FOLDER,
      data: { id },
    });
  };
};

export const setCurrFolderId = id => ({
  type: SET_CURR_FOLDER_ID,
  data: { id },
});

export const editFolder = (folderId, newTitle) => {
  return async dispatch => {
    const newFolder = await editFolderTitle(folderId, newTitle);
    const { id, title } = newFolder;
    dispatch({
      type: EDIT_FOLDER,
      data: { id, title },
    });
  };
};

export const createTodo = (title, description) => ({
  type: CREATE_TODO,
  data: {
    title,
    description,
  },
});

export const toggleTodo = id => ({
  type: TOGGLE_TODO,
  data: { id },
});

export const removeTodo = id => ({
  type: REMOVE_TODO,
  data: { id },
});

export const refreshTodosAfterDrop = newTodos => ({
  type: REFRESH_TODOS_AFTER_DROP,
  data: { newTodos },
});

export const initFolders = id => {
  return async dispatch => {
    try {
      const folders = await fetchFolders(id);
      dispatch({
        type: SET_FOLDERS,
        data: { folders },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setFilter = filter => ({
  type: SET_FILTER,
  data: { filter },
});

export const resetFilter = () => ({
  type: RESET_FILTER,
});

export const setFoldersLoading = () => ({ type: SET_FOLDERS_LOADING });
export const resetFoldersLoading = () => ({ type: RESET_FOLDERS_LOADING });
export const setFolderAfterAccepting = folder => ({
  type: SET_FOLDER_AFTER_ACCEPTING,
  data: { folder },
});

export const refreshSharedFolder = folder => ({
  type: REFRESH_FOLDER,
  data: { folder },
});

export const refreshFolders = () => {
  return async (dispatch, getState) => {
    dispatch(setCurrFolderId(null));
    dispatch(setFoldersLoading());
    const userId = getState().user.data.id;
    const folders = await fetchFolders(userId);
    dispatch({ type: SET_FOLDERS, data: { folders } });
    dispatch(resetFoldersLoading());
  };
};
