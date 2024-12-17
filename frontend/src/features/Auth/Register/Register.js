import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import axiosInstance from '../../../api/axiosInstance';
import './Register.scss';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['ROLE_PARTICIPANT', 'ROLE_ORGANIZER_ADMIN', 'ROLE_ORGANIZER']),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms of use',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    terms: false,
  });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    setIsLoading(true);

    try {
      registerSchema.parse(formData);
      const response = await axiosInstance.post('/api/auth/register', formData);
      setAlert({ type: 'success', message: response.data.message });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setAlert({ type: 'error', message: error.errors[0].message });
      } else if (error.response) {
        setAlert({
          type: 'error',
          message: error.response.data.message || 'An error occurred during registration',
        });
      } else {
        setAlert({ type: 'error', message: 'Unable to connect to the server' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Sign Up</h1>
          <p>Create your account and join us.</p>
        </div>

        {alert.message && (
          <div className={`alert ${alert.type}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              className="form-input"
            >
              <option value="" disabled>
                Select Your Role
              </option>
              <option value="ROLE_PARTICIPANT">Participant</option>
              <option value="ROLE_ORGANIZER_ADMIN">Organizer Admin</option>
              <option value="ROLE_ORGANIZER">Organizer</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            />
            <label>I agree to the terms of service</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="sign-up-button"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="login-link">
            <span>Already have an account? </span>
            <Link to="/login" className="sign-in-link">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
