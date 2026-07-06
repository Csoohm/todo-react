import { useState, useEffect } from "react";

const STORAGE_KEY = "todo-react-tasks";

function App() {
  const [task, setTask] = useState("");

  // Load saved tasks from localStorage on first render
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // completedAt was stored as a string, convert it back to a Date
      return parsed.map((t) => ({
        ...t,
        completedAt: t.completedAt ? new Date(t.completedAt) : null,
      }));
    } catch {
      return [];
    }
  });

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([
      ...tasks,
      { text: task, completed: false, completedAt: null }
    ]);

    setTask("");
  };


  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? new Date() : null
        };
      }
      return task;
    });
    setTasks(newTasks);
  };


  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  const startEditTask = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const saveEditTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editingText } : task
    );
    setTasks(newTasks);
    setEditingIndex(null);
    setEditingText("");
  };

  const deleteAllTasks = () => {
    if (tasks.length === 0) return;
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTasks([]);
    }
  };





  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">📝 To Do List</h3>


              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a new task ..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />

                <div className="d-flex">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={addTask}
                  >
                    Add
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={deleteAllTasks}
                  >
                    Delete All
                  </button>
                </div>
              </div>



              <ul className="list-group">
                {tasks.map((task, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{
                      backgroundColor: task.completed ? "#d4edda" : "white",
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center">
                        <span
                          style={{
                            textDecoration: task.completed ? "line-through" : "none",
                            marginRight: "10px"
                          }}
                        >
                          {task.text}
                        </span>

                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={task.completed}
                          onChange={() => toggleTask(index)}
                        />
                      </div>

                      {task.completed && task.completedAt && (
                        <small className="text-muted d-block">
                          Completed at: {task.completedAt.toLocaleString()}
                        </small>
                      )}

                    </div>

                    <div className="d-flex">
                      {editingIndex === index ? (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => saveEditTask(index)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => startEditTask(index)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteTask(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>



                ))}

              </ul>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;