import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LandingPage from '../features/LandingPage/LandingPage';
import ProfilePage from '../features/ProfilePage/ProfilePage';
import EventPage from '../features/Event/EventPage';
import EventShow from '../features/Event/EventShow';
import TaskPage from '../features/Task/TaskPage';

const PrivateRoutes = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (!accessToken) return <Navigate to="/login" replace />;

  const eventsAllowed = ['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_PARTICIPANT'].includes(user?.role);
  const tasksAllowed = ['ROLE_ADMIN', 'ROLE_ORGANIZER_ADMIN', 'ROLE_ORGANIZER'].includes(user?.role);

  return (
    <Routes>
      <Route path="/home/*" element={<LandingPage />} />
      <Route path="/profile/*" element={<ProfilePage />} />
      {eventsAllowed && <Route path="/events" element={<EventPage />} />}
      {eventsAllowed && <Route path="/events/:id" element={<EventShow />} />}
      {tasksAllowed && <Route path="/tasks" element={<TaskPage />} />}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default PrivateRoutes;
