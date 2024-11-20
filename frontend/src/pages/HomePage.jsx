import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/welcome.scss'; // Assurez-vous que le chemin est correct

const WelcomePage = () => {
  const navigate = useNavigate();

  // Fonction pour rediriger l'utilisateur vers le tableau de bord
  const handleExploreClick = () => {
    navigate("/dashboard"); // Redirection vers un tableau de bord ou autre page
  };

  // Fonction pour rediriger vers la page de Login
  const handleLoginClick = () => {
    navigate("/login"); // Redirection vers la page de connexion
  };

  // Fonction pour rediriger vers la page d'inscription
  const handleRegisterClick = () => {
    navigate("/registration"); // Redirection vers la page d'inscription
  };

  return (
    <div className="welcome-container">
      <div className="welcome-message">
        <h1>Bienvenue sur notre plateforme d'événements !</h1>
        <p>
          Organisez et planifiez vos événements facilement. Découvrez toutes les fonctionnalités et commencez votre aventure.
        </p>
        <button onClick={handleExploreClick} className="explore-btn">
          Explorer
        </button>

        <div className="auth-links">
          <button onClick={handleLoginClick} className="auth-btn">
            Se connecter
          </button>
          <button onClick={handleRegisterClick} className="auth-btn">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
