import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import TodoItem from "../../components/TodoItem/TodoItem";
import {
  refreshTodosAfterDrop,
  setFilter,
  patchTodosAfterStateUpdate,
  refreshSharedFolder,
  toggleTodo,
  removeTodo,
  resetStateAfterUpdate,
} from "../../reducers/collectionReducer";

import "./Todos.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const StyledTodos = styled.div`
  width: 550px;
  position: relative;
  min-height: 600px;
  max-height: 650px;
  background-color: var(--white);
  box-shadow: 6px 6px 3px var(--dark);
  border-radius: 1.5px;
  padding: 0px 10px 15px 10px;
  display: flex;
  flex-direction: column;
  ${({ active }) =>
    !active &&
    css`
      background-color: rgba(0, 0, 0, 0.8);
      pointer-events: none;
    `}

  & h1 {
    text-align: center;

    margin: 12px;
    color: var(--white);

    &#folder__title {
      text-transform: uppercase;
      color: var(--dark);
    }
    &.fallback__header {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      width: 100%;
      text-align: center;
      transform: translate(0, -50%);
    }
  }
`;

const switchBtnInfo = [
  {
    name: "all",
  },
  {
    name: "todo",
  },
  {
    name: "completed",
  },
];

const Todos = () => {
  const [folderSelected, setFolderSelected] = useState(null);
  const [isListActive, setIsListActive] = useState(false);
  const [todosToDisplay, setTodosToDisplay] = useState([]);

  const listRef = useRef(null);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

  const {
    currFolderId,
    foldersLoading,
    folders,
    stateAfterUpdate,
  } = useSelector(({ collection }) => collection);

  const currFolder = currFolderId
    ? folders.find(folder => folder.id === currFolderId)
    : null;

  const currFilter = useSelector(({ collection }) => collection.currFilter);

  const filterTodos = () => {
    switch (currFilter) {
      case "all":
        setTodosToDisplay(todos);
        break;
      case "todo":
        setTodosToDisplay(todos.filter(todo => !todo.checked));
        break;
      case "completed":
        setTodosToDisplay(todos.filter(todo => todo.checked));
        break;
    }
  };

  const todos = currFolder ? currFolder.todos : null;

  useEffect(() => {
    if (folders.length && foldersLoading) {
      setFolderSelected(false);
    }
  }, [folders, foldersLoading]);

  useEffect(() => {
    if (currFolderId) setFolderSelected(true);
    else {
      setIsListActive(false);
      setFolderSelected(false);
      setTodosToDisplay([]);
    }
  }, [currFolderId]);

  useEffect(() => {
    if (!foldersLoading && folderSelected) setIsListActive(true);
  }, [foldersLoading, folderSelected]);

  useEffect(() => {
    if (!todos || !stateAfterUpdate) {
      return;
    }
    const updateTodos = async () => {
      await dispatch(patchTodosAfterStateUpdate());
      filterTodos();
      dispatch(resetStateAfterUpdate());
    };
    updateTodos();
  }, [todos]);

  useEffect(() => {
    if (todos) filterTodos();
  }, [todos, currFilter]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (currFolderId && currFolder && currFolder.shared) {
      intervalRef.current = setInterval(
        () => dispatch(refreshSharedFolder()),
        5000
      );
    }
  }, [currFolderId]);

  const setFilterHandler = e => {
    const filter = e.target.dataset.filter;
    return currFilter !== filter ? dispatch(setFilter(filter)) : null;
  };

  /*
  Once the Item is droped this callback is fired
  to trigger list rerender with rearranged state items
  */
  const refreshStateAfterDrop = id => {
    const domList = listRef.current.firstChild;
    const iterDomList = [...domList.querySelectorAll("li")];
    //Find the new index of dragged elemnt in DOM
    const draggedIndex = iterDomList.indexOf(
      iterDomList.find(li => li.id === id)
    );
    const draggedTodo = todosToDisplay.find(todo => todo.id === id);
    const newTodos = [...todos];
    //Delete the dragged todo...
    const updatedNewTodos = newTodos.filter(todo => todo.id !== draggedTodo.id);
    //...and insert it on the new DOM position
    updatedNewTodos.splice(draggedIndex, 0, draggedTodo);

    dispatch(refreshTodosAfterDrop(updatedNewTodos));
  };

  const getDragAfterElement = y => {
    // Select all elements except for the selected Item
    const draggableElements = [
      ...listRef.current.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, current) => {
        const box = current.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset)
          return { offset, element: current };
        else return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
      }
    ).element;
  };

  let memoizedId = "";
  const dragOverHandler = e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    if (
      (afterElement && afterElement.id === memoizedId) ||
      afterElement === memoizedId
    )
      return;
    setTimeout(() => {
      memoizedId = afterElement ? afterElement.id : undefined;
    }, 0);
    const draggable = document.querySelector(".dragging");
    //Select the list of Todos
    const domList = listRef.current.firstChild;
    //Transform the NodeList of list Items into iterable array
    const iterDomList = [...domList.querySelectorAll("li")];
    if (iterDomList.length <= 1) return;
    /*
    If the selected Item is in the very bottom,
    change the "top" property of the previously last
    element on the list and then append the selected item to the end of the list
    */
    if (afterElement === undefined) {
      iterDomList[iterDomList.length - 2].style.top = `calc(${
        iterDomList.length - 2
      } * 55px)`;
      iterDomList[iterDomList.length - 1].style.top = `calc(${
        iterDomList.length - 1
      } * 55px)`;
      domList.appendChild(draggable);
    } else {
      /*
      if you drag the item down, do the following...
      */
      if (iterDomList.indexOf(draggable) < iterDomList.indexOf(afterElement)) {
        for (
          let i = iterDomList.indexOf(draggable) + 1;
          i < iterDomList.indexOf(afterElement);
          i++
        ) {
          iterDomList[i].style.top = `calc(${i - 1} * 55px)`;
        }
      } else {
        /*
        if you move the item up, do the following...
        */
        for (
          let i = iterDomList.indexOf(draggable) - 1;
          i >= iterDomList.indexOf(afterElement);
          i--
        ) {
          iterDomList[i].style.top = `calc(${i + 1} * 55px)`;
        }
      }
      domList.insertBefore(draggable, afterElement);
    }
  };

  const toggleTodoHandler = id => {
    dispatch(toggleTodo(id));
  };

  const removeTodoHandler = id => {
    dispatch(removeTodo(id));
  };
  return (
    <StyledTodos active={isListActive}>
      {foldersLoading && <h1 className="fallback__header">Loading...</h1>}
      {folderSelected === false && !foldersLoading && (
        <h1 className="fallback__header">
          Please select a folder to edit Todos or create a new one
        </h1>
      )}
      {isListActive && currFolder && (
        <>
          <h1 id="folder__title">{currFolder.title}</h1>
          <div className="todos__hero">
            <div className="todos__switch__btn__container">
              {switchBtnInfo.map((btn, i) => (
                <button
                  key={i}
                  data-filter={btn.name}
                  className={`switch__btn ${
                    btn.name === currFilter ? "selected" : ""
                  }`}
                  onClick={setFilterHandler}
                >
                  {btn.name}
                </button>
              ))}
            </div>
            <ul
              className="todos__list"
              ref={listRef}
              onDragOver={e => dragOverHandler(e)}
            >
              {todosToDisplay.length ? (
                <TransitionGroup>
                  {todosToDisplay.map((todo, i) => (
                    <CSSTransition
                      key={todo.id}
                      timeout={300}
                      classNames="slide"
                    >
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        checked={todo.checked}
                        draggable={currFilter === "all" ? true : false}
                        refreshStateAfterDrop={refreshStateAfterDrop}
                        index={i}
                        onToggle={() => toggleTodoHandler(todo.id)}
                        onRemove={() => removeTodoHandler(todo.id)}
                      />
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              ) : (
                <h2 id="list__empty__alert">No completed todos yet 😔</h2>
              )}
            </ul>
          </div>
        </>
      )}
    </StyledTodos>
  );
};

export default Todos;
