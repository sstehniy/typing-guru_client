import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTodo } from "../../reducers/collectionReducer";
import { CSSTransition } from "react-transition-group";
import "./CreateTodo.scss";

const CreateTodo = () => {
  const [currTitleInput, setCurrTitleInput] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [currMoreInput, setCurrMoreInput] = useState("");

  const dispatch = useDispatch();

  const currentTodos = useSelector(({ collection }) =>
    collection.folders.length && collection.currFolderId
      ? collection.folders.find(folder => folder.id === collection.currFolderId)
          .todos
      : null
  );
  const enterPrssedHandler = e => {
    return e.keyCode === 13 ? createTodoHandler() : null;
  };

  const inputChangeHandler = useCallback(e => {
    setCurrTitleInput(e.target.value);
  }, []);

  const moreChangeHandler = useCallback(e => {
    setCurrMoreInput(e.target.value);
  }, []);

  const createTodoHandler = () => {
    console.log(currentTodos);
    if (
      currTitleInput.trim().length &&
      currentTodos !== null &&
      !currentTodos.find(todo => todo.title === currTitleInput.trim())
    ) {
      dispatch(createTodo(currTitleInput, currMoreInput));
    } else {
      setTitleError(true);
      setTimeout(() => {
        setTitleError(false);
        console.log("done");
      }, 5000);
    }
    setCurrTitleInput("");
  };

  return (
    <div className="create__todo">
      {currentTodos === null && (
        <div className="inactive">
          <h2>Please Choose/Add a Folder to add new Todos</h2>
        </div>
      )}
      <h2>New Todo</h2>
      <div className="title__container">
        <label>Title</label>
        <input
          type="text"
          placeholder="Learn Vue"
          className="input"
          value={currTitleInput}
          onChange={inputChangeHandler}
          onKeyDown={enterPrssedHandler}
        />
        <CSSTransition
          in={titleError}
          classNames="msg-slide"
          timeout={300}
          mountOnEnter
          unmountOnExit
        >
          <p className="msg__error">Please give a unique title to your new TODO</p>
        </CSSTransition>
      </div>

      <label>Description</label>
      <div className="description__container">
        <textarea
          className="input textarea"
          rows="7"
          onChange={moreChangeHandler}
          placeholder="Open the Vue Mastery book and start learning..."
          value={currMoreInput}
        />
        <button onClick={createTodoHandler} className="submit">
          create
        </button>
      </div>
    </div>
  );
};

export default CreateTodo;
