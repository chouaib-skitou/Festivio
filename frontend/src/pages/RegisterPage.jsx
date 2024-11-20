import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { registerSchema } from "../validationSchemas/registerSchema"; // Make sure this Zod schema is created
import axios from "axios"; // Import Axios
import { z } from "zod";
import '../styles/login.scss'; // You can use the same SCSS file if needed

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manual check for password confirmation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    // Validation using Zod
    try {
      registerSchema.parse(formData);
      setErrors({}); // Reset errors if validation passes

      // API request to register a new user using Axios
      const { data } = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setUser(data.user); // Update user after registration
      localStorage.setItem("accessToken", data.accessToken); // Optional: store the token
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log(data);
      navigate("/login"); // Redirect to the homepage after registration
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Display Zod validation errors
        setErrors(err.errors.reduce((acc, cur) => ({ ...acc, [cur.path[0]]: cur.message }), {}));
      } else if (err.response) {
        // Handle server errors with Axios
        alert(`Server error: ${err.response.data.message || "Registration failed"}`);
      } else {
        // Handle other errors
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Register</h1>

        <div className="input-group">
          <label htmlFor="username">User name</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="submit-btn">
          Register
        </button>

        <div className="forgot-password">
          <a href="/login">Already have an account? Log in</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
