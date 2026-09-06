import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MarketingNav from './MarketingNav';
import WorkspaceNav from './WorkspaceNav';
import './NavBar.scss';

const workspacePrefixes = ['/home', '/events', '/tasks', '/profile'];

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isWorkspace = workspacePrefixes.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return isWorkspace ? <WorkspaceNav open={open} setOpen={setOpen} /> : <MarketingNav open={open} setOpen={setOpen} />;
};

export default NavBar;
