import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Mainapp from "./components/Main";
import Task from "./components/Task";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Finish React project",
      status: "pending",
      priority: "high",
      dueDate: "2025-09-28",
      createdAt: "2025-09-20",
      tags: ["work", "coding"],
      description: "Complete the frontend for the task manager app using React.",
    },
    {
      id: 2,
      name: "Study Node.js event loop",
      status: "done",
      priority: "medium",
      dueDate: "2025-09-22",
      createdAt: "2025-09-18",
      tags: ["study", "backend"],
      description: "Revise Node.js event loop concepts for interview prep.",
    },
    {
      id: 3,
      name: "Prepare for interview",
      status: "pending",
      priority: "high",
      dueDate: "2025-09-30",
      createdAt: "2025-09-21",
      tags: ["career", "urgent"],
      description: "Prepare answers for common DSA and MERN stack interview questions.",
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <Navbar  />
                <Mainapp />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/task/:id"
          element={
            <PrivateRoute>
              <Task tasks={tasks} setTasks={setTasks} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
