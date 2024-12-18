import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import axiosInstance from '../../../api/axiosInstance';
import useAuthStore from '../../../stores/authStore';

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
      loginSchema.parse(formData);
      const response = await axiosInstance.post('/api/auth/login', formData);
      console.log(response.data);

      const { token, refreshToken, user } = response.data;

      setToken(token);
      setRefreshToken(refreshToken);
      setUser(user);

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

  const inputClasses = "w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your account and stay connected.</p>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className={inputClasses}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className={inputClasses}
            />
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading ? "Signing you in..." : "Sign In"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Create one here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
