import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Mainapp = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "",
    tags: "",
  });

  // ✅ fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/tasks",{
           withCredentials: true,
        });
        console.log(res.data)
        setTasks(res.data.tasks || []); 
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // ✅ delete task (with backend call)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ✅ add task
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!taskForm.name || !taskForm.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const payload = {
        ...taskForm,
        tags: taskForm.tags
          ? taskForm.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      const res = await axios.post("http://localhost:3000/tasks", payload,{
        withCredentials:true
      });
      console.log(res)

      setTasks((prev) => [...prev, res.data]); 
      setTaskForm({
        name: "",
        description: "",
        status: "pending",
        priority: "low",
        dueDate: "",
        tags: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // ✅ priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6">
      {/* Add Task Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Task Name"
            value={taskForm.name}
            onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Task Description"
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm({ ...taskForm, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <select
            value={taskForm.priority}
            onChange={(e) =>
              setTaskForm({ ...taskForm, priority: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={taskForm.status}
            onChange={(e) =>
              setTaskForm({ ...taskForm, status: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>

          <input
            type="date"
            value={taskForm.dueDate}
            onChange={(e) =>
              setTaskForm({ ...taskForm, dueDate: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={taskForm.tags}
            onChange={(e) =>
              setTaskForm({ ...taskForm, tags: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          >
            Save Task
          </button>
        </form>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-gray-600 font-medium text-center">
          You don't have any task in the app
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{task.name}</h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(task._id);
                    }}
                    className="text-red-500 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-gray-600 mt-2">{task.description}</p>

                <div className="mt-3 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        task.status === "done"
                          ? "text-green-600"
                          : "text-orange-600"
                      }
                    >
                      {task.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Priority:</span>{" "}
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Due Date:</span>{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
           
          ))}
        </div>
      )}
    </div>
  );
};

export default Mainapp;
