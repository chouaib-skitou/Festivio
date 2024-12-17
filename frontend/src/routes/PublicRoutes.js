// src/routes/PublicRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/Home/HomePage';
import Login from '../features/Auth/Login/Login';
import Register from '../features/Auth/Register/Register';
import ForgotPassword from '../features/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from '../features/Auth/ResetPassword/ResetPassword';
import PrivateRoutes from './PrivateRoutes';

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id" element={<ResetPassword />} />
      {/* Private Routes */}
      <Route path="/*" element={<PrivateRoutes />} />
    </Routes>
  );
};

export default PublicRoutes;
