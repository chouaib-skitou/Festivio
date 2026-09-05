import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import axiosInstance from '../../../api/axiosInstance';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must contain at least 2 characters.'),
    lastName: z.string().min(2, 'Last name must contain at least 2 characters.'),
    username: z.string().min(3, 'Username must contain at least 3 characters.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(10, 'Password must contain at least 10 characters.'),
    confirmPassword: z.string(),
    role: z.enum(['ROLE_PARTICIPANT', 'ROLE_ORGANIZER']),
    terms: z.literal(true, { errorMap: () => ({ message: 'Accept the terms to continue.' }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
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
    role: 'ROLE_PARTICIPANT',
    terms: false,
  });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAlert({ type: '', message: '' });
    setIsLoading(true);

    try {
      registerSchema.parse(formData);
      const response = await axiosInstance.post('/api/auth/register', formData, {
        _skipAuthRefresh: true,
      });
      setAlert({ type: 'success', message: response.data.message });
      window.setTimeout(() => navigate('/login'), 1200);
    } catch (submitError) {
      if (submitError instanceof z.ZodError) {
        setAlert({ type: 'error', message: submitError.errors[0].message });
      } else {
        setAlert({
          type: 'error',
          message: submitError.response?.data?.message || 'Unable to create your account.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card auth-card-wide" aria-labelledby="register-title">
        <Link to="/" className="auth-brand">Festivio</Link>
        <div>
          <p className="eyebrow">Join Festivio</p>
          <h1 id="register-title">Create your account</h1>
          <p className="auth-subtitle">Participant and organizer accounts can be created publicly. Administrative roles are assigned internally.</p>
        </div>

        {alert.message && (
          <div className={`auth-alert auth-alert-${alert.type}`}>{alert.message}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-grid">
            <label>First name<input value={formData.firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} required /></label>
            <label>Last name<input value={formData.lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} required /></label>
          </div>
          <div className="auth-grid">
            <label>Username<input value={formData.username} onChange={(event) => setFormData({ ...formData, username: event.target.value })} required /></label>
            <label>
              Account type
              <select value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })}>
                <option value="ROLE_PARTICIPANT">Participant</option>
                <option value="ROLE_ORGANIZER">Organizer</option>
              </select>
            </label>
          </div>
          <label>Email<input type="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required /></label>
          <div className="auth-grid">
            <label>Password<input type="password" autoComplete="new-password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required /></label>
            <label>Confirm password<input type="password" autoComplete="new-password" value={formData.confirmPassword} onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} required /></label>
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={formData.terms} onChange={(event) => setFormData({ ...formData, terms: event.target.checked })} />
            <span>I agree to use Festivio responsibly.</span>
          </label>
          <button type="submit" className="primary-button full-width" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-footnote">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
};

export default Register;
