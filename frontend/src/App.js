import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard"; // Exemple de redirection après login
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./routes/PrivateRoutes/PrivateRoute"; // Importez le composant PrivateRoute

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegisterPage />} />
      
      {/* Route protégée avec PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
