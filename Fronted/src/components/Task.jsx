import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Task = () => {
  const { id } = useParams(); // get task id from URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "low",
    status: "pending",
    dueDate: "",
  });

  useEffect(() => {
    // Fetch task from backend
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/${id}`);
        const taskData = response.data;
        setTask(taskData);
        setFormData({
          name: taskData.name,
          description: taskData.description,
          priority: taskData.priority,
          status: taskData.status,
          dueDate: taskData.dueDate.split("T")[0], // if date comes in ISO format
        });
      } catch (err) {
        console.error(err);
        navigate("/"); // redirect if task not found
      }
    };
    fetchTask();
  }, [id, navigate]);

  if (!task) return <p>Loading...</p>;

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, formData);
      setTask(response.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      navigate("/"); // go back to main page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      {editing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{task.name}</h1>
          <p>{task.description}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={task.status === "done" ? "text-green-600" : "text-orange-600"}>
              {task.status}
            </span>
          </p>
          <p>
            <strong>Priority:</strong>{" "}
            <span
              className={
                task.priority === "high"
                  ? "text-red-600"
                  : task.priority === "medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {task.priority}
            </span>
          </p>
          <p>
            <strong>Due Date:</strong> {task.dueDate.split("T")[0]}
          </p>
          <p>
            <strong>Created At:</strong> {task.createdAt.split("T")[0]}
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            {task.tags?.map((tag, i) => (
              <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mr-1">
                {tag}
              </span>
            ))}
          </p>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
