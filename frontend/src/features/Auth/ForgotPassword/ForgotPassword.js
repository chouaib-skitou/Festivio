import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/reset-password-request', { email });
      setMessage(response.data.message || 'Password reset link sent to your email.');

      // Navigate to login immediately after successful request
      navigate('/login');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred.');
      } else {
        setError('Unable to connect to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {message && (
            <div className="error-message" style={{ backgroundColor: '#e7f4e4', color: '#34A853' }}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="sign-in-button"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="create-account">
            <span>Remember your password? </span>
            <Link to="/login" className="sign-up-link">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
