import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCity, FaPhone, FaCamera, FaSignInAlt } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    prenom: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "Client",
    city: "",
    telephone: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append("avatar", image);

    try {
      const response = await axios.post("http://localhost:5000/register", data);
      if (response.data && response.data.user) {
        alert(response.data.message);
        const { role } = response.data.user;
        if (role === "Client") navigate("/home");
        else if (role === "Vendeur") navigate("/profile");
        else if (role === "Admin") navigate("/admin");
      } else {
        setErrorMessage("Registration failed! Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed! Server error.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",
      margin: 0,
      padding: "20px",
      position: "relative",
      backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
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
      maxWidth: "450px",
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
      marginBottom: "20px",
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
      ":hover": {
        borderColor: "#ff6b35",
      },
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #e0e6ed",
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: "#f7f9fc",
      cursor: "pointer",
    },
    fileInputWrapper: {
      position: "relative",
      marginBottom: "20px",
      textAlign: "center",
    },
    fileInputLabel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px",
      border: "2px dashed #e0e6ed",
      borderRadius: "8px",
      cursor: "pointer",
      color: "#6c757d",
      transition: "all 0.3s ease",
      ":hover": {
        borderColor: "#ff6b35",
        color: "#ff6b35",
      },
    },
    avatarPreview: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover",
      margin: "10px auto",
      display: "block",
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
      ":hover": {
        backgroundColor: "#e65c2e",
      },
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
    link: {
      marginTop: "20px",
      textAlign: "center",
      color: "#6c757d",
      fontSize: "14px",
    },
    linkSpan: {
      color: "#ff6b35",
      cursor: "pointer",
      fontWeight: 500,
      ":hover": {
        textDecoration: "underline",
      },
    },
  };

  // Animation CSS
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);

  return (
    <div style={styles.container}>
      <div style={styles.blurOverlay}></div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.header}>
          <FaSignInAlt style={styles.headerIcon} />
          <h1 style={styles.headerTitle}>Inscription</h1>
        </div>

        <div style={styles.inputGroup}>
          <FaUser style={styles.inputIcon} />
          <input type="text" name="name" placeholder="Nom" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <FaUser style={styles.inputIcon} />
          <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <FaEnvelope style={styles.inputIcon} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <FaCity style={styles.inputIcon} />
          <input type="text" name="city" placeholder="Ville" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <FaPhone style={styles.inputIcon} />
          <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <FaLock style={styles.inputIcon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div style={styles.inputGroup}>
          <FaLock style={styles.inputIcon} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            placeholder="Confirmer mot de passe"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div style={styles.inputGroup}>
          <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
            <option value="Client">Client</option>
            <option value="Vendeur">Vendeur</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div style={styles.fileInputWrapper}>
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden id="fileUpload" />
          <label htmlFor="fileUpload" style={styles.fileInputLabel}>
            <FaCamera /> {image ? "Image sélectionnée" : "Choisir un avatar"}
          </label>
          {image && <img src={URL.createObjectURL(image)} alt="Avatar" style={styles.avatarPreview} />}
        </div>

        <button type="submit" style={styles.button}>
          <FaSignInAlt style={{ fontSize: "18px" }} />
          S'inscrire
        </button>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        <p style={styles.link}>
          Déjà un compte ?{" "}
          <span style={styles.linkSpan} onClick={() => navigate("/login")}>
            Se connecter
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;