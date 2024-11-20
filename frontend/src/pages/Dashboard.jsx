import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import useAuthStore from "../store/authStore"; // Import our authentication store
import '../styles/dashboard.scss'; // Make sure the path to your SCSS file is correct

const Dashboard = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser); // To reset the user

  // Logout function
  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Reset the user in the store
    setUser(null);

    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
