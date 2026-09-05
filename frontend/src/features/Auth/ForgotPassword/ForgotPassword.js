import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        '/api/auth/reset-password-request',
        { email },
        { _skipAuthRefresh: true }
      );
      setMessage(response.data.message);
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to process the request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="forgot-title">
        <Link to="/" className="auth-brand">Festivio</Link>
        <p className="eyebrow">Account recovery</p>
        <h1 id="forgot-title">Reset your password</h1>
        <p className="auth-subtitle">Enter your email. If an account exists, Festivio will send a one-time reset link.</p>
        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {message && <div className="auth-alert auth-alert-success">{message}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <button type="submit" className="primary-button full-width" disabled={isLoading}>{isLoading ? 'Sending…' : 'Send reset link'}</button>
        </form>
        <p className="auth-footnote"><Link to="/login">Back to sign in</Link></p>
      </section>
    </main>
  );
};

export default ForgotPassword;
