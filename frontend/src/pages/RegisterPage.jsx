// src/pages/RegisterPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { registerUser } from "../api/UserAPI"; // Import de la fonction registerUser
import '../styles/login.scss'; // Tu peux utiliser le même fichier SCSS si nécessaire

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
    // Appel à la fonction registerUser pour gérer l'inscription
    registerUser(formData, setErrors, setUser, navigate);
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
