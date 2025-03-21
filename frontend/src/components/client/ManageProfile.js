import React, { useState, useEffect } from "react";
import axios from "axios";
 
const ManageProfile = () => {
  const userId = "65a1234b567c89d012345678"; // Remplace par l'ID de l'utilisateur connecté
  const [user, setUser] = useState({
    name: "",
    prenom: "",
    email: "",
    telephone: "",
    city: "",
    avatar: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState("");

  // Récupérer les infos du client
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        setPreviewAvatar(res.data.avatar);
      })
      .catch((err) => console.error("Erreur de chargement du profil:", err));
  }, [userId]);

  // Gérer les modifications dans le formulaire
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Gérer l'upload de l'avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Envoyer la mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/profile/${userId}`, user);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Gérer votre profil</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="avatar-container">
          <img src={previewAvatar || "/default-avatar.png"} alt="Avatar" />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <label>Nom :</label>
        <input type="text" name="name" value={user.name} onChange={handleChange} required />

        <label>Prénom :</label>
        <input type="text" name="prenom" value={user.prenom} onChange={handleChange} required />

        <label>Email :</label>
        <input type="email" name="email" value={user.email} onChange={handleChange} required />

        <label>Téléphone :</label>
        <input type="text" name="telephone" value={user.telephone} onChange={handleChange} required />

        <label>Ville :</label>
        <input type="text" name="city" value={user.city} onChange={handleChange} required />

        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default ManageProfile;
