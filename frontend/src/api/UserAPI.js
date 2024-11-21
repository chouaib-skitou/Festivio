// src/api/UserAPI.js

import axios from "axios";
import { registerSchema } from "../validationSchemas/registerSchema"; // Assure-toi que ce schéma Zod est bien créé
import { loginSchema } from "../validationSchemas/loginSchema";
import { z } from "zod";

// Fonction pour se connecter
const loginUser = async (formData, setErrors, setUser, navigate) => {
  try {
    // Validation using Zod
    loginSchema.parse(formData);
    setErrors({}); // Reset errors if validation passes

    // Axios API request
    const { data } = await axios.post("http://localhost:5000/api/auth/login", formData, {
      headers: { "Content-Type": "application/json" },
    });

    setUser(data.user); // Update the connected user
    localStorage.setItem("accessToken", data.accessToken); // Optional: store the token
    localStorage.setItem("refreshToken", data.refreshToken);
    navigate("/dashboard"); // Redirect to the dashboard
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Display Zod validation errors
      setErrors(err.errors.reduce((acc, cur) => ({ ...acc, [cur.path[0]]: cur.message }), {}));
    } else if (err.response) {
      // Handle Axios server error
      alert(`Server error: ${err.response.data.message || "Invalid credentials"}`);
    } else {
      // Handle other errors
      alert(`Error: ${err.message}`);
    }
  }
};

// Fonction pour s'inscrire
const registerUser = async (formData, setErrors, setUser, navigate) => {
  // Vérification manuelle des mots de passe
  if (formData.password !== formData.confirmPassword) {
    setErrors({ confirmPassword: "Passwords do not match" });
    return;
  }

  try {
    // Validation avec Zod
    registerSchema.parse(formData);
    setErrors({}); // Réinitialiser les erreurs si la validation passe

    // Requête API pour l'inscription
    const { data } = await axios.post("http://localhost:5000/api/auth/register", formData, {
      headers: { "Content-Type": "application/json" },
    });

    setUser(data.user); // Mettre à jour l'utilisateur après l'inscription
    localStorage.setItem("accessToken", data.accessToken); // Stockage du token
    localStorage.setItem("refreshToken", data.refreshToken);
    console.log(data);
    navigate("/login"); // Rediriger vers la page de login après l'inscription
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Afficher les erreurs de validation Zod
      setErrors(err.errors.reduce((acc, cur) => ({ ...acc, [cur.path[0]]: cur.message }), {}));
    } else if (err.response) {
      // Gérer les erreurs serveur avec Axios
      alert(`Server error: ${err.response.data.message || "Registration failed"}`);
    } else {
      // Gérer les autres erreurs
      alert(`Error: ${err.message}`);
    }
  }
};

export { loginUser, registerUser };
