import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axiosInstance from './api/axiosInstance';
import NavBar from './components/NavBar/NavBar';
import Routes from './routes/PublicRoutes';
import useAuthStore from './stores/authStore';

const App = () => {
  const hydrated = useAuthStore((state) => state.hydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const response = await axiosInstance.post(
          '/api/auth/refresh-token',
          undefined,
          { _skipAuthRefresh: true }
        );
        if (active) setSession(response.data);
      } catch (_error) {
        if (active) clearSession();
      } finally {
        if (active) setHydrated(true);
      }
    };

    restoreSession();
    return () => {
      active = false;
    };
  }, [clearSession, setHydrated, setSession]);

  if (!hydrated) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <div className="app-loading-mark">F</div>
        <span>Loading Festivio…</span>
      </div>
    );
  }

  return (
    <Router>
      <NavBar />
      <Routes />
    </Router>
  );
};

export default App;
