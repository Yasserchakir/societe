import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import Header from "./Header";
import "./profile.css";
import '../App.css';  
import SideBarClient from './SideBarClient';
import SideBarVendeur from './SideBarVendeur';

const GereProfile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role")?.trim(); // Trim to remove any spaces

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = response.data;
        setUser(data);
        setName(data.name || '');
        setPrenom(data.prenom || '');
        setEmail(data.email || '');
        setCity(data.city || '');
        setTelephone(data.telephone || '');
        setAvatar(data.avatar || '');
      } catch (error) {
        console.error("Erreur lors du chargement du profil", error);
        setError("Impossible de charger le profil.");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("city", city);
    formData.append("telephone", telephone);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.put("http://localhost:5000/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Profil mis à jour avec succès !");
      setError(null);
      setUser(response.data.user);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      setError("Une erreur est survenue lors de la mise à jour.");
      setMessage(null);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="content">
      <Header /> 
      {role === "Admin" && <SideBar />}
      {role === "Vendeur" && <SideBarVendeur />}
      {role === "Client" && <SideBarClient />}
      <div className="profile-container">
        <h1>Gérer Votre Profil</h1>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Nom</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" />
          </div>

          <div className="form-group">
            <label>Ville</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Votre ville" />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Votre téléphone" />
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
          </div>

          <button type="submit" className="submit-btn">Mettre à jour</button>
        </form>
      </div>
    </div>
  );
};

export default GereProfile;
