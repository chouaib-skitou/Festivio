// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Routes from './routes/PublicRoutes';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes />
    </Router>
  );
};

export default App;
