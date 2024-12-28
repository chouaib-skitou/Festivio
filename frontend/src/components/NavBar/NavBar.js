import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import './NavBar.scss';

const NavBar = () => {
  const location = useLocation();

  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      {/* Logo à gauche */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          <Play className="logo-icon" />
          <span>Flowbite</span>
        </Link>
      </div>

      {/* Liens à droite */}
      <div className="navbar-right">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/services" 
          className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
        >
          Services
        </Link>

        {accessToken ? (
          <>
            <Link 
              to="/events" 
              className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}
            >
              Events
            </Link>
            <button onClick={handleLogout} className="nav-link logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
