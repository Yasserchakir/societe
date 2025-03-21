import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateSociete.css';

const CreateSociete = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    typeVendeur: '',
    nomEntreprise: '',
    nomVendeur: '',
    secteurActivite: '',
    description: '',
    email: '',
    numeroTelephone: '',
    ribIban: '',
    methodesPaiement: [],
    numeroEnregistrement: '',
    nomResponsable: '',
    adresseEntreprise: '',
    statutJuridique: '',
    adresseCorrespondance: '',
  });

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;
    if (type === 'select-multiple') {
      const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/societes', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Société créée:', response.data);
      alert('Société créée avec succès!');
      navigate('/societes');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Erreur lors de la création:', error);
        alert('Erreur: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="create-societe-container">
      <h2 className="form-title">Créer une Nouvelle Société</h2>
      <Link to="/societes" className="back-btn">Retour à la Liste</Link>
      <form onSubmit={handleSubmit} className="societe-form">
        <div className="form-group">
          <label>Type de Vendeur</label>
          <select name="typeVendeur" value={formData.typeVendeur} onChange={handleChange} required>
            <option value="">Sélectionnez</option>
            <option value="Personne physique">Personne physique</option>
            <option value="Société">Société</option>
          </select>
        </div>

        {formData.typeVendeur === 'Société' && (
          <>
            <div className="form-group">
              <label>Nom de l'Entreprise</label>
              <input type="text" name="nomEntreprise" value={formData.nomEntreprise} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Numéro d'Enregistrement</label>
              <input type="text" name="numeroEnregistrement" value={formData.numeroEnregistrement} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Nom du Responsable</label>
              <input type="text" name="nomResponsable" value={formData.nomResponsable} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Adresse de l'Entreprise</label>
              <input type="text" name="adresseEntreprise" value={formData.adresseEntreprise} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Statut Juridique</label>
              <input type="text" name="statutJuridique" value={formData.statutJuridique} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Adresse de Correspondance</label>
              <input type="text" name="adresseCorrespondance" value={formData.adresseCorrespondance} onChange={handleChange} />
            </div>
          </>
        )}

        {formData.typeVendeur === 'Personne physique' && (
          <div className="form-group">
            <label>Nom du Vendeur</label>
            <input type="text" name="nomVendeur" value={formData.nomVendeur} onChange={handleChange} required />
          </div>
        )}

        <div className="form-group">
          <label>Secteur d'Activité</label>
          <select name="secteurActivite" value={formData.secteurActivite} onChange={handleChange} required>
            <option value="">Sélectionnez</option>
            <option value="Informatique">Informatique</option>
            <option value="Construction">Construction</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Numéro de Téléphone</label>
          <input type="text" name="numeroTelephone" value={formData.numeroTelephone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>RIB/IBAN</label>
          <input type="text" name="ribIban" value={formData.ribIban} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Méthodes de Paiement</label>
          <select name="methodesPaiement" multiple value={formData.methodesPaiement} onChange={handleChange} required>
            <option value="Carte bancaire">Carte bancaire</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Créer la Société</button>
      </form>
    </div>
  );
};

export default CreateSociete;