// frontend (Vite)
"scripts"; { "dev"; "vite", "build"; "vite build", "preview"; "vite preview" }
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const API = "http://localhost:5000";


export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`);
      // Initialize frontend-only 'reminded' flag for todos
      const todosWithReminded = res.data.map((t) => ({
        ...t,
        reminded: false,
      }));
      setTodos(todosWithReminded);
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await axios.post(`${API}/todos`, {
        text: newTodo,
        reminderTime: reminderTime || null,
        completed: false,
      });
      setNewTodo("");
      setReminderTime("");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API}/todos/${id}`, { completed: !completed });
      setTodos((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, completed: !completed } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Frontend-only single reminder
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (
            !todo.completed && // skip completed todos
            todo.reminderTime &&
            !todo.reminded &&
            new Date(todo.reminderTime).getTime() <= now.getTime()
          ) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            // Speak reminder
            const msg = new SpeechSynthesisUtterance(`Do your todo: ${todo.text}`);
            msg.rate = 1;
            msg.pitch = 1;
            msg.volume = 1;
            window.speechSynthesis.speak(msg);

            // Popup alert as backup
            alert(`Reminder: ${todo.text}`);

            // Mark as reminded in frontend only
            return { ...todo, reminded: true };
          }
          return todo;
        })
      );
    };

    const interval = setInterval(checkReminders, 1000);
    return () => clearInterval(interval);
  }, [todos]);

  const pendingTodos = todos.filter((t) => !t.completed);
  const doneTodos = todos.filter((t) => t.completed);

  return (
    <div className="app">
      {/* Add Todo */}
      <div className="add-todo">
        <input
          type="text"
          placeholder="Add a todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {/* Pending */}
        <div className="todo-section">
          <h2>⏳ Pending</h2>
          {pendingTodos.length === 0 && <p>No pending todos</p>}
          {pendingTodos.map((todo) => (
            <div key={todo._id} className="todo-item pending">
              <span>
                {todo.text}{" "}
                {todo.reminderTime && (
                  <small>⏰ {new Date(todo.reminderTime).toLocaleString()}</small>
                )}
              </span>
              <div>
                <button onClick={() => toggleTodo(todo._id, todo.completed)}>✅ Done</button>
                <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        {/* Done */}
        <div className="todo-section">
          <h2>✅ Done</h2>
          {doneTodos.length === 0 && <p>No done todos</p>}
          {doneTodos.map((todo) => (
            <div key={todo._id} className="todo-item done">
              <span>{todo.text}</span>
              <div>
                <button onClick={() => toggleTodo(todo._id, todo.completed)}>↩ Pending</button>
                <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
