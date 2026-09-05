import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import axiosInstance from '../../../api/axiosInstance';
import useAuthStore from '../../../stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      loginSchema.parse(formData);
      const response = await axiosInstance.post('/api/auth/login', formData, {
        _skipAuthRefresh: true,
      });
      setSession(response.data);
      navigate('/home', { replace: true });
    } catch (submitError) {
      if (submitError instanceof z.ZodError) {
        setError(submitError.errors[0].message);
      } else if (submitError.response) {
        setError(submitError.response.data.message || 'Unable to sign in.');
      } else {
        setError('Unable to connect to Festivio.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="login-title">
        <Link to="/" className="auth-brand">Festivio</Link>
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to your workspace</h1>
          <p className="auth-subtitle">Manage events, assignments and participation from one place.</p>
        </div>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              required
            />
          </label>
          <div className="auth-row">
            <span />
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button type="submit" className="primary-button full-width" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footnote">
          New to Festivio? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
