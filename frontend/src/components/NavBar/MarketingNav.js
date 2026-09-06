import React from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import Brand from './Brand';

const MarketingNav = ({ open, setOpen }) => {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const close = () => setOpen(false);
  const active = (path) => (location.pathname === path ? 'active' : '');

  return (
    <header className="site-header marketing-header">
      <nav className="navbar marketing-navbar" aria-label="Website navigation">
        <Brand onClick={close} />

        <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle website navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`navbar-links marketing-links ${open ? 'open' : ''}`}>
          <a href="/#features" onClick={close}>Features</a>
          <a href="/#workflow" onClick={close}>How it works</a>
          {accessToken ? (
            <Link to="/home" className="nav-cta" onClick={close}>Open workspace <ArrowRight size={16} /></Link>
          ) : (
            <>
              <Link to="/login" className={active('/login')} onClick={close}>Sign in</Link>
              <Link to="/register" className="nav-cta" onClick={close}>Get started <ArrowRight size={16} /></Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default MarketingNav;
