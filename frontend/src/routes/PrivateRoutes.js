// src/routes/PrivateRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LandingPage from '../features/LandingPage/LandingPage';
import ProfilePage from "../features/ProfilePage/ProfilePage";
import EventPage from "../features/Event/EventPage";

const PrivateRoutes = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return accessToken ? (
    <Routes>
      <Route path="/home/*" element={<LandingPage />} />
      {/* Add nested private routes here */}
      <Route path="/profile/*" element={<ProfilePage />} />
      <Route path="/events" element={<EventPage />} />
    </Routes>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;