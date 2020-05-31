import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrFolderId,
  resetFilter,
  removeFolder,
  createFolder,
} from "../../reducers/collectionReducer";
import { setNotification } from "../../reducers/uiReducer";
import "./Folders.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ReactComponent as AddIcon } from "../../assets/add.svg";
import FolderItem from "../FolderItem/FolderItem";

const Folders = () => {
  const dispatch = useDispatch();
  const currFolderId = useSelector(({ collection }) => collection.currFolderId);
  const collection = useSelector(({ collection }) => collection);
  const userData = useSelector(({ user }) => user.data);
  const history = useHistory();
  const match = useRouteMatch();
  const setFolderHandler = id => {
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

  const shareFolderHandler = id => {
    if (collection.folders.find(f => f.id === id).shared)
      return dispatch(
        setNotification({
          header: "Alert",
          body: "This folder is already shared ",
        })
      );
    history.push(`${match.url}/${id}/user-search`);
  };

  return (
    <div className="folders__container">
      <h2>Your Folders</h2>
      <div className="list__wrapper">
        <div className="add-icon__wrapper" onClick={addFolderHandler}>
          <AddIcon />
        </div>
        {!collection.foldersLoading ? (
          <ul className="folders__list">
            {collection.folders.map(({ id, title, shared }) => (
              <FolderItem
                key={id}
                id={id}
                currFolderId={currFolderId}
                title={title}
                shared={shared}
                onClick={() => setFolderHandler(id)}
                onRemove={() => removeFolderHandler(id)}
                onShare={() => shareFolderHandler(id)}
              />
            ))}
          </ul>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </div>
  );
};

export default Folders;
