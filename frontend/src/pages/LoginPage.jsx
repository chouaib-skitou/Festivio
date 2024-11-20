import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { loginSchema } from "../validationSchemas/loginSchema";
import axios from "axios"; // Import Axios
import { z } from "zod";
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

    // Validation using Zod
    try {
      loginSchema.parse(formData);
      setErrors({}); // Reset errors if validation passes

      // Axios API request
      const { data } = await axios.post("http://localhost:5000/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setUser(data.user); // Update the connected user
      localStorage.setItem("accessToken", data.accessToken); // Optional: store the token
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log(data);
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Display Zod validation errors
        setErrors(err.errors.reduce((acc, cur) => ({ ...acc, [cur.path[0]]: cur.message }), {}));
      } else if (err.response) {
        // Handle Axios server error
        alert(`Server error: ${err.response.data.message || "Invalid credentials"}`);
      } else {
        // Handle other errors
        alert(`Error: ${err.message}`);
      }
    }
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
