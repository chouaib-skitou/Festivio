// src/features/LandingPage/LandingPage.js
import React from 'react';
import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="home-page flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-4">Welcome to Festivio</h1>
      <p className="text-xl">You are logged in.</p>
    </div>
  );
};

export default LandingPage;
