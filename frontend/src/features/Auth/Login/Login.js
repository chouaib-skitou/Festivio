import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import axiosInstance from '../../../api/axiosInstance';
import useAuthStore from '../../../stores/authStore';
import './Login.scss';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate form inputs
      loginSchema.parse(formData);
      
      // Send login request
      const response = await axiosInstance.post('/api/auth/login', formData);
      console.log(response.data);

      // Destructure tokens and user from the response
      const { token, refreshToken, user } = response.data;

      // Save to Zustand store and localStorage
      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);

      // Navigate to home page
      navigate('/home');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else if (error.response) {
        setError(error.response.data.message || 'An error occurred during login');
      } else {
        setError('Unable to connect to the server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account and stay connected.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>

          <div className="form-options">
            <Link to="/forgot-password" className="forgot-password">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="sign-in-button"
          >
            {isLoading ? "Signing you in..." : "Sign In"}
          </button>

          <div className="create-account">
            <p>
              Don’t have an account?{' '}
              <Link to="/register" className="sign-up-link">
                Create one here.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
