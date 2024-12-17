// src/features/Home/HomePage.js
import React from 'react';
import './HomePage.scss';

const HomePage = () => {
  return (
    <div className="home-page flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-4">Welcome to Festivio</h1>
      <p className="text-xl">Your ultimate event management platform.</p>
    </div>
  );
};

export default HomePage;
