import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Nouvel état pour la notification de succès

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      if (response.data && response.data.user && response.data.token) {
        // Afficher le message de bienvenue
        setSuccessMessage(`Bienvenue, ${response.data.user.email}!`);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role.trim());
        const userRole = response.data.user.role.trim();
        console.log("User role:", userRole);

        // Redirection après un délai pour laisser le temps de voir la notification
        setTimeout(() => {
          switch (userRole) {
            case "Admin":
              navigate("/admin");
              break;
            case "Vendeur":
              navigate("/profile");
              break;
            case "Client":
              navigate("/profile");
              break;
            default:
              setErrorMessage("Rôle invalide ! Redirection impossible.");
          }
        }, 2000); // Délai de 2 secondes
      } else {
        setErrorMessage("Échec de connexion ! Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setErrorMessage("Échec de connexion ! Erreur du serveur.");
    }
  };

  const goToSignup = () => {
    navigate("/"); // Correction de la route vers "/signup"
  };

  const styles = {
    container: {
      display: "flex",
      marginLeft: "500px",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      height: "100%",
      width: "100vw",
      margin: 0,
      padding: "20px",
      position: "relative",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      overflow: "hidden",
    },
    blurOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "inherit",
      filter: "blur(8px)",
      zIndex: 0,
    },
    form: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "12px",
      padding: "40px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      position: "relative",
      zIndex: 1,
      animation: "fadeIn 0.5s ease-in-out",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "32px",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#293241",
      margin: 0,
    },
    headerIcon: {
      fontSize: "32px",
      color: "#ff6b35",
    },
    inputGroup: {
      position: "relative",
      marginBottom: "24px",
    },
    inputIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#6c757d",
      fontSize: "18px",
    },
    input: {
      width: "100%",
      padding: "12px 16px 12px 48px",
      border: "1px solid #e0e6ed",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#f7f9fc",
      transition: "all 0.3s ease",
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#ff6b35",
      color: "white",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    error: {
      marginTop: "16px",
      textAlign: "center",
      color: "#ef476f",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 12px",
      backgroundColor: "rgba(239, 71, 111, 0.1)",
      borderRadius: "6px",
    },
    signupText: {
      marginTop: "16px",
      textAlign: "center",
      color: "#ff6b35",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      textDecoration: "underline",
    },
    success: {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: "#28a745",
      color: "white",
      padding: "12px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      fontSize: "16px",
      fontWeight: 500,
      animation: "slideIn 0.5s ease-in-out",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.blurOverlay}></div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.header}>
          <FaSignInAlt style={styles.headerIcon} />
          <h1 style={styles.headerTitle}>Connexion</h1>
        </div>

        <div style={styles.inputGroup}>
          <FaEnvelope style={styles.inputIcon} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <FaLock style={styles.inputIcon} />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          <FaSignInAlt style={{ fontSize: "18px" }} />
          Se connecter
        </button>

        <p style={styles.signupText} onClick={goToSignup}>
          Créer un compte
        </p>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </form>

      {/* Notification de succès */}
      {successMessage && <div style={styles.success}>{successMessage}</div>}
    </div>
  );
}

export default Login;