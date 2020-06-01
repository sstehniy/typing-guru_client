import React, { useState, useEffect, useRef } from "react";
import "./FolderItem.scss";
import { useDispatch } from "react-redux";
import { editFolder } from "../../reducers/collectionReducer";
import { setNotification } from "../../reducers/uiReducer";

import Skeleton from "../Shared/UI/LoadingSkeleton";

import { ReactComponent as EditIcon } from "../../assets/draw.svg";
import { ReactComponent as ShareIcon } from "../../assets/share.svg";
import { ReactComponent as RmIcon } from "../../assets/rubbish.svg";
import { ReactComponent as ArrowIcon } from "../../assets/multimedia-option.svg";

const FolderItem = ({
  id,
  title,
  currFolderId,
  shared = false,
  onSelect,
  onRemove,
  onShare,
}) => {
  const [inEditMode, setInEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currNewTitle, setCurrNewTitle] = useState(title);
  const dispatch = useDispatch();

  const editInputRef = useRef(null);

  useEffect(() => {
    if (inEditMode) editInputRef.current.select();
  }, [inEditMode]);

  const editTitleHandler = () => {
    return currNewTitle.trim().length
      ? currNewTitle !== title
        ? (() => {
            dispatch(editFolder(id, currNewTitle.trim()));
            setInEditMode(false);
          })()
        : null
      : dispatch(
          setNotification({
            header: "Warning",
            body: "Folder title must not be empty",
          })
        );
  };

  const toggleEditMode = () => {
    setInEditMode(prevMode => !prevMode);
  };
  const setCurrNewTitleHandler = e => {
    setCurrNewTitle(e.target.value);
  };

  const removeFolderItemHandler = () => {
    setIsDeleting(true);
    onRemove();
  };

  return isDeleting ? (
    <LoadingFolderItem />
  ) : (
    <div className={`folder__item ${currFolderId === id ? "selected" : ""}`}>
      {inEditMode ? (
        <div className="edit__wrapper">
          <input
            value={currNewTitle}
            ref={editInputRef}
            autoFocus={true}
            onChange={setCurrNewTitleHandler}
          />
          <button onClick={editTitleHandler}>Edit</button>
        </div>
      ) : (
        <p className="folder__title">{title}</p>
      )}
      <ul className="folder__item-control">
        <li
          className={`control__item ${shared ? "shared" : "unshared"} `}
          onClick={onShare}
        >
          <ShareIcon />
        </li>
        <li className="control__item" onClick={toggleEditMode}>
          <EditIcon style={{ fill: "#0B4F6C	" }} />
        </li>
        <li className="control__item" onClick={removeFolderItemHandler}>
          <RmIcon style={{ fill: "#92140C" }} />
        </li>
        <li className="control__item" onClick={onSelect}>
          <ArrowIcon style={{ transform: "rotate(-90deg)", fill: "#000000" }} />
        </li>
      </ul>
    </div>
  );
};

export const LoadingFolderItem = () => {
  return (
    <div className="folder__item">
      <Skeleton />
    </div>
  );
};

export default FolderItem;
