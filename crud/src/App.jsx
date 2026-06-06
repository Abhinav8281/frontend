import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

axios.get(`${API_URL}/api/users`);

function App() {
  const API = "http://localhost:5000/api/tasks";

  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const [editId, setEditId] = useState(null);


  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `${API}/${editId}`,
          form
        );

        alert("Task Updated");
        setEditId(null);
      } else {
        await axios.post(API, form);
        alert("Task Added");
      }

      setForm({
        title: "",
        description: "",
        status: "Pending",
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };


  const handleEdit = (task) => {
    setEditId(task._id);

    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      alert("Task Deleted");

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager CRUD</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Enter Description"
          value={form.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        <button type="submit">
          {editId
            ? "Update Task"
            : "Add Task"}
        </button>
      </form>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            className="task-card"
            key={task._id}
          >
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <strong>Status:</strong>{" "}
              {task.status}
            </p>

            <button
              onClick={() =>
                handleEdit(task)
              }
            >
              Edit
            </button>

            <button
              className="delete"
              onClick={() =>
                handleDelete(task._id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;