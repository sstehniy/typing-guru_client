import React, { useState, useEffect, useRef } from "react";
import "./FolderItem.scss";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  editFolder,
  removeFolder,
  setCurrFolderId,
} from "../../reducers/collectionReducer";

import { ReactComponent as EditIcon } from "../../assets/draw.svg";
import { ReactComponent as ShareIcon } from "../../assets/share.svg";
import { ReactComponent as RmIcon } from "../../assets/rubbish.svg";
import { ReactComponent as ArrowIcon } from "../../assets/multimedia-option.svg";

const FolderItem = ({
  id,
  title,
  currFolderId,
  shared = false,
  onClick,
  onRemove,
  onShare,
}) => {
  const [inEditMode, setInEditMode] = useState(false);
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
      : console.log("no empty titles!!!");
  };

  const toggleEditMode = () => {
    setInEditMode(prevMode => !prevMode);
  };
  const setCurrNewTitleHandler = e => {
    setCurrNewTitle(e.target.value);
  };

  return (
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
        <li className="control__item" onClick={onRemove}>
          <RmIcon style={{ fill: "#92140C" }} />
        </li>
        <li className="control__item" onClick={onClick}>
          <ArrowIcon style={{ transform: "rotate(-90deg)", fill: "#000000" }} />
        </li>
      </ul>
    </div>
  );
};

FolderItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  shared: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FolderItem;
