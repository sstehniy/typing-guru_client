import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import anime from "animejs/lib/anime.es";

import { removeTodo, toggleTodo } from "../../reducers/collectionReducer";

import "./TodoItem.scss";
import { ReactComponent as Check } from "../../assets/confirm.svg";
import { ReactComponent as Delete } from "../../assets/shapes-and-symbols.svg";

const Todo = ({
  todo,
  checked = false,
  refreshStateAfterDrop,
  index,
  draggable,
}) => {
  const [dragging, setDragging] = useState(null);
  const [dropping, setDropping] = useState(false);
  const checkedBtnRef = useRef(null);
  const todoRef = useRef(null);
  const dispatch = useDispatch();

  const { title, description, id } = todo;

  const checkedClickedHandler = id => {
    checkedBtnRef.current.className = "non-active";

    const btnRef = anime({
      targets: checkedBtnRef.current,
      scale: 1.2,
      rotate: "0.06turn",
      duration: 200,
      easing: "easeInOutSine",
      direction: "alternate",
    });
    anime({
      targets: todoRef.current,
      backgroundColor: checked ? "#B86C66" : "#2a9d8f",
      duration: 200,
      easing: "easeInOutSine",
      direction: "alternate",
    });
    btnRef.play();
    btnRef.finished
      .then(() => (checkedBtnRef.current.className = ""))
      .then(() => dispatch(toggleTodo(id)));
  };

  const handleDragStart = () => {
    setDragging(true);
    setTimeout(() => setDragging(false), 0);
  };

  const handleDragEnd = async () => {
    const promise = new Promise((resolve, _) => {
      refreshStateAfterDrop(todoRef.current.id);
      resolve();
    });
    await promise;
    setDragging(null);
    setTimeout(() => setDropping(true), 0);

    const dropAnimation = anime({
      targets: todoRef.current,
      duration: 350,
      scale: [1.07, 1],
      easing: "easeOutElastic(1, 1)",
    });
    dropAnimation.finished.then(() => setDropping(false));
  };

  const todoStyle = {
    top: `calc(${index} * 55px)`,
  };

  return (
    <li
      className={`todo__item ${draggable ? "draggable" : ""} ${
        dragging === true ? "dragStart" : dragging === false ? "dragging" : ""
      } ${dropping === true ? "dropping" : ""} ${checked ? "checked" : ""}`}
      id={id}
      checked={checked}
      ref={todoRef}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      index={index}
      style={todoStyle}
    >
      <p className={checked ? "checked" : " "}>{title}</p>
      <div id="btn__container">
        <span onClick={() => checkedClickedHandler(id)} ref={checkedBtnRef}>
          <Check fill="green" />
        </span>
        <span onClick={() => dispatch(removeTodo(id))}>
          <Delete fill="#e63946" />
        </span>
      </div>
    </li>
  );
};

Todo.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  checked: PropTypes.bool.isRequired,
  refreshStateAfterDrop: PropTypes.func,
  index: PropTypes.number,
  draggable: PropTypes.bool.isRequired,
};
export default Todo;
