import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { loginSchema } from "../validationSchemas/loginSchema";
import { z } from "zod";
import '../styles/login.scss';  // Assurez-vous que le chemin du fichier SCSS est correct

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      loginSchema.parse(formData);
      setErrors({}); // Réinitialise les erreurs si la validation passe

      // Exemple de requête API (remplacez par votre logique réelle)
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      setUser(data.user); // Mettre à jour l'utilisateur connecté
      localStorage.setItem("accessToken", data.accessToken); // Optionnel : stocker le token
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log(data);
      navigate("/dashboard"); // Redirige vers le tableau de bord
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
      <form
        onSubmit={handleSubmit}
        className="login-form"
      >
        <h1>Connexion</h1>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="submit-btn"
        >
          Se connecter
        </button>

        <div className="forgot-password">
          <a href="/forgot-password">Forgot password ?</a>
        </div>
        <div className="forgot-password">
          <a href="/registration">registration</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
