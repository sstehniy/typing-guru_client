import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrFolderId,
  resetFilter,
  removeFolder,
  createFolder,
  refreshFolders,
} from "../../reducers/collectionReducer";
import { setNotification } from "../../reducers/uiReducer";
import "./Folders.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ReactComponent as AddIcon } from "../../assets/add.svg";
import { ReactComponent as RefreshSVG } from "../../assets/refresh.svg";
import FolderItem, { LoadingFolderItem } from "../FolderItem/FolderItem";

const Folders = () => {
  const dispatch = useDispatch();

  const collection = useSelector(({ collection }) => collection);
  const userData = useSelector(({ user }) => user.data);
  const history = useHistory();
  const match = useRouteMatch();

  const selectFolderHandler = id => {
    dispatch(setCurrFolderId(id));
    dispatch(resetFilter());
  };

  const addFolderHandler = () => {
    dispatch(createFolder());
  };

  const removeFolderHandler = id => {
    dispatch(setCurrFolderId(null));
    dispatch(removeFolder(id));
  };

  const refreshFoldersHandler = () => {
    dispatch(refreshFolders());
  };

  const shareFolderHandler = id => {
    if (!userData.isVerified)
      return dispatch(
        setNotification({
          header: "Alert",
          body:
            "Please verify your email to be able to share folders with other users",
        })
      );
    if (collection.folders.find(f => f.id === id).shared)
      return dispatch(
        setNotification({
          header: "Alert",
          body: "This folder is already shared",
        })
      );
    history.push(`${match.url}/${id}/user-search`);
  };

  return (
    <div className="folders__container">
      <h2>Your Folders</h2>
      <div className="icons__container">
        <div className="icon__wrapper" onClick={addFolderHandler}>
          <AddIcon />
        </div>
        <div className="icon__wrapper" onClick={refreshFoldersHandler}>
          <RefreshSVG />
        </div>
      </div>
      <div className="list__wrapper">
        {!collection.foldersLoading ? (
          <ul className="folders__list">
            {collection.folders.map(({ id, title, shared }) => (
              <FolderItem
                key={id}
                id={id}
                currFolderId={collection.currFolderId}
                title={title}
                shared={shared}
                onSelect={() => selectFolderHandler(id)}
                onRemove={() => removeFolderHandler(id)}
                onShare={() => shareFolderHandler(id)}
              />
            ))}
            {collection.creatingFolder && <LoadingFolderItem />}
          </ul>
        ) : (
          <h2 id="loading">Loading...</h2>
        )}
      </div>
    </div>
  );
};

export default Folders;
