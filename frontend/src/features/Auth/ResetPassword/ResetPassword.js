import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id: token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 10) {
      setError('Password must contain at least 10 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post(
        `/api/auth/reset-password/${token}`,
        { newPassword: password, confirmPassword },
        { _skipAuthRefresh: true }
      );
      navigate('/login', { replace: true });
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to reset your password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="reset-title">
        <Link to="/" className="auth-brand">Festivio</Link>
        <p className="eyebrow">Secure recovery</p>
        <h1 id="reset-title">Choose a new password</h1>
        <p className="auth-subtitle">Use at least 10 characters and avoid reusing a password from another service.</p>
        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>New password<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <label>Confirm password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
          <button type="submit" className="primary-button full-width" disabled={isLoading}>{isLoading ? 'Updating…' : 'Update password'}</button>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
