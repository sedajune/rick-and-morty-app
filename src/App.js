import create from "zustand";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
//import { useStore } from "react";

const add = (array, item, { prepend } = {}) => {
  return prepend ? [item, ...array] : [...array, item];
};

const remove = (array, index) => {
  const clone = [...array];
  clone.splice(index, 1);
  return clone;
};

const move = (array, previousIndex, nextIndex) => {
  const clone = [...array];
  clone.splice(nextIndex, 0, ...clone.splice(previousIndex, 1));
  return clone;
};

const useStore = create((set) => ({
  todos: [],
  addTodo: (item, { prepend } = {}) => {
    set((state) => ({
      todos: add(state.todos, item, { prepend }),
    }));
  },
  removeTodo: (index) => {
    set((state) => ({
      todos: remove(state.todos, index),
    }));
  },
  moveTodo: (previousIndex, nextIndex) => {
    set((state) => ({
      todos: move(state.todos, previousIndex, nextIndex),
    }));
  },
  counter: 0,
  increment: () => {
    set((state) => ({
      counter: state.counter + 1,
    }));
  },
  decrement: () => {
    // No return
    // Side effect (update)
    set((state) => {
      // Returns a partial (new state)
      return {
        counter: state.counter - 1,
      };
    });
  },
}));

function App() {
  const counter = useStore((state) => state.counter);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const [value, setValue] = useState("");
  const [todos, setTodos] = useState([
    { name: "Wash dishes", isChecked: true, id: uuid() },
  ]);

  return (
    <div>
      {counter}
      <br />
      <button onClick={increment}>+</button>

      <button onClick={decrement}>-</button>

      <span>
        <input
          type="text"
          value={value}
          onChange={(event_) => {
            setValue(event_.target.value);
          }}
        />
        <button disabled={!value} type="submit">
          Create
        </button>

        <ul>
          {todos.map((todo, index) => {
            return (
              <li key={todo.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.isChecked}
                    onChange={() => {
                      console.log(`Item: ${todo.id}`);
                      const update = [...todos];
                      update[index].isChecked = !update[index].isChecked;
                      setTodos(update);
                    }}
                  />
                  <span
                    style={{
                      textDecoration: todo.isChecked ? "line-through" : "none",
                    }}
                  >
                    {todo.name}
                  </span>
                </label>
                <button
                  onClick={() => {
                    const update = [...todos];
                    update.splice(index, 1);
                    setTodos(update);
                  }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </span>
    </div>
  );
}

export default App;
