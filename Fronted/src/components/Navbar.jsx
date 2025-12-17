import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/users/logout",
        {},
        { withCredentials: true } 
      );
      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 shadow-md">
      <h1 className="text-white text-2xl font-bold">Task Manager</h1>

      

      <div className="flex gap-2">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
