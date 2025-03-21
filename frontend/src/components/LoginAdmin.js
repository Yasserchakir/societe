import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginAdmin.css"; // Import the CSS file

const LoginAdmin = () => {
  const [signIn, setSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [prenom, setPrenom] = useState("");
  const [city, setCity] = useState("");
  const [telephone, setTelephone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{8,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log("Mode:", signIn ? "Sign In" : "Sign Up");

    const url = signIn
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    if (!signIn && !validatePhone(telephone)) {
      setErrorMessage("Le numéro de téléphone doit contenir entre 8 et 15 chiffres.");
      return;
    }

    const payload = signIn
      ? { email, password, role: "Admin" }
      : { email, password, name, prenom, city, telephone, role: "Admin" };

    try {
      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data && res.data.token && res.data.user) {
        const { token, user } = res.data;
        // Stocker le token dans localStorage au lieu d'utiliser useAuth
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ id: user._id, role: user.role }));
        navigate("/admin");
      } else {
        setErrorMessage("Réponse invalide du serveur. Veuillez réessayer.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'opération."
      );
    }
  };

  const toggleMode = (mode) => {
    setSignIn(mode);
    setErrorMessage("");
  };

  return (
    <div className={`container ${signIn ? "" : "active"}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSubmit}>
          <h1>Create Admin Account</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Téléphone (8-15 chiffres)"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleSubmit}>
          <h1>Admin Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
          <span>or use your email password</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#">Mot de passe oublié ?</a>
          <button type="submit">Sign In</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
      </div>

      {/* Toggle Container */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Bienvenue, Admin !</h1>
            <p>Connectez-vous pour gérer le système avec vos identifiants admin.</p>
            <button className="hidden" onClick={() => toggleMode(true)}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Bonjour, Nouvel Admin !</h1>
            <p>Créez un compte admin pour commencer à gérer la plateforme.</p>
            <button className="hidden" onClick={() => toggleMode(false)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;