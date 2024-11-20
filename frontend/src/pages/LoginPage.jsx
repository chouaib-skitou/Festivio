// src/pages/LoginPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { loginUser } from "../api/UserAPI"; // Utilise l'import nommé
import '../styles/login.scss'; // Ensure the SCSS file path is correct

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Appel à la fonction loginUser pour gérer la connexion
    loginUser(formData, setErrors, setUser, navigate);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Log in</h1>
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
        <button type="submit" className="submit-btn">
          Log in
        </button>

        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <div className="forgot-password">
          <a href="/registration">Register now</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
