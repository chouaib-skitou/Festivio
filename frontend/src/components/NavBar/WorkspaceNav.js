import React from 'react';
import { ArrowLeft, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import useAuthStore from '../../stores/authStore';
import Brand from './Brand';

const WorkspaceNav = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const close = () => setOpen(false);
  const active = (path) => (location.pathname === path || location.pathname.startsWith(`${path}/`) ? 'active' : '');

  const links = [{ to: '/home', label: 'Overview' }];
  if (['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_PARTICIPANT'].includes(user?.role)) links.push({ to: '/events', label: 'Events' });
  if (['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_ORGANIZER'].includes(user?.role)) links.push({ to: '/tasks', label: 'Tasks' });
  links.push({ to: '/profile', label: 'Profile' });

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout', undefined, { _skipAuthRefresh: true });
    } finally {
      clearSession();
      close();
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="site-header workspace-header">
      <nav className="navbar workspace-navbar" aria-label="Workspace navigation">
        <div className="workspace-brand-group">
          <Brand to="/home" compact onClick={close} />
          <span className="workspace-divider" aria-hidden="true" />
          <span className="workspace-label">Workspace</span>
        </div>

        <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle workspace navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`navbar-links workspace-links ${open ? 'open' : ''}`}>
          <Link to="/" className="back-to-site" onClick={close}><ArrowLeft size={15} /> Website</Link>
          {links.map((link) => <Link key={link.to} to={link.to} className={active(link.to)} onClick={close}>{link.label}</Link>)}
          <button className="nav-quiet-button" onClick={handleLogout}><LogOut size={15} /> Sign out</button>
        </div>
      </nav>
    </header>
  );
};

export default WorkspaceNav;
