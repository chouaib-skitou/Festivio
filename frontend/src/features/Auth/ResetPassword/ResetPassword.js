import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id: token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/auth/reset-password/${token}`, {
        newPassword: password,
        confirmPassword,
      });
      setMessage(response.data.message || 'Password successfully changed.');
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

  const inputClasses = "w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">Please enter your new password.</p>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-50 text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="p-4 rounded-md bg-green-50 text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClasses}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
