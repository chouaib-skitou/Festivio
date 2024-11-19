import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { registerSchema } from "../validationSchemas/registerSchema"; // Assurez-vous que ce schéma Zod est créé
import { z } from "zod";
import '../styles/login.scss'; // Vous pouvez utiliser le même fichier SCSS si nécessaire

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [errors, setErrors] = useState({});
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation avec Zod
    try {
      registerSchema.parse(formData);
      setErrors({}); // Réinitialise les erreurs si la validation passe

      // Requête API pour enregistrer un nouvel utilisateur
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");

      const data = await response.json();
      setUser(data.user); // Met à jour l'utilisateur après inscription
      localStorage.setItem("accessToken", data.accessToken); // Optionnel : stocker le token
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log(data);
      navigate("/dashboard"); // Redirige vers le tableau de bord après inscription
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Affiche les erreurs de validation Zod
        setErrors(err.errors.reduce((acc, cur) => ({ ...acc, [cur.path[0]]: cur.message }), {}));
      } else {
        alert("Erreur : " + err.message); // Erreur serveur ou autre
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Inscription</h1>

        <div className="input-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn">
          S'inscrire
        </button>

        <div className="forgot-password">
          <a href="/login">Déjà un compte ? Connectez-vous</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
