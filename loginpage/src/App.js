import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard"; // Exemple de redirection après login
import RegisterPage from "./pages/RegisterPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/registration" element={<RegisterPage />} />
    </Routes>
  </Router>
);

export default App;
