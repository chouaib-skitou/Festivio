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

  const inputClasses = "w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account and join us.</p>
        </div>

        {alert.message && (
          <div className={`p-4 rounded-md ${
            alert.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className={`${inputClasses} appearance-none`}
              >
                <option value="" disabled>Select Your Role</option>
                <option value="ROLE_PARTICIPANT">Participant</option>
                <option value="ROLE_ORGANIZER_ADMIN">Organizer Admin</option>
                <option value="ROLE_ORGANIZER">Organizer</option>
              </select>
            </div>
          </div>

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className={inputClasses}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className={inputClasses}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className={inputClasses}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-600">
              I agree to the terms of service
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
