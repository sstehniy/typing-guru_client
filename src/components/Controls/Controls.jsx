import React from "react";
import "./Controls.scss";
import PropTypes from "prop-types";
import CreateTodo from "../../components/CreateTodo/CreateTodo";
import Folders from "../../components/Folders/Folders";

const Controls = _props => {
  return (
    <div className="controls__container">
      <CreateTodo />
      <Folders />
    </div>
  );
};

Controls.propTypes = {};

export default Controls;
