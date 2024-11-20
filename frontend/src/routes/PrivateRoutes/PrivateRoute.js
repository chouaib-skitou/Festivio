import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Vérifiez si l'utilisateur est connecté, ici en utilisant le localStorage comme exemple.
  const isAuthenticated = localStorage.getItem("accessToken");

  // Si l'utilisateur est authentifié, on affiche la page protégée (avec Outlet)
  // Sinon, on redirige vers la page de login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};



export default PrivateRoute;
