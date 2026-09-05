import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, Menu, X } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../stores/authStore';
import './NavBar.scss';

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const close = () => setOpen(false);
  const active = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout', undefined, { _skipAuthRefresh: true });
    } finally {
      clearSession();
      close();
      navigate('/', { replace: true });
    }
  };

  const workspaceLinks = [];
  if (['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_PARTICIPANT'].includes(user?.role)) {
    workspaceLinks.push({ to: '/events', label: 'Events' });
  }
  if (['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_ORGANIZER'].includes(user?.role)) {
    workspaceLinks.push({ to: '/tasks', label: 'Tasks' });
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark"><CalendarDays size={19} /></span>
          <span>Festivio</span>
        </Link>

        <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>

        <div className={`navbar-links ${open ? 'open' : ''}`}>
          <Link to="/" className={active('/')} onClick={close}>Home</Link>
          <Link to="/services" className={active('/services')} onClick={close}>Platform</Link>
          {accessToken ? (
            <>
              <Link to="/home" className={active('/home')} onClick={close}>Workspace</Link>
              {workspaceLinks.map((link) => <Link key={link.to} to={link.to} className={active(link.to)} onClick={close}>{link.label}</Link>)}
              <Link to="/profile" className={active('/profile')} onClick={close}>Profile</Link>
              <button className="nav-quiet-button" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className={active('/login')} onClick={close}>Sign in</Link>
              <Link to="/register" className="nav-cta" onClick={close}>Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
