import React, { useState } from 'react';
import axios from 'axios';
import './AddSocieteForm.css';  // Custom CSS for styling

const AddSocieteForm = () => {
  const [formData, setFormData] = useState({
    typeVendeur: 'Société',
    nomEntreprise: '',
    nomVendeur: '',
    secteurActivite: '',
    description: '',
    email: '',
    numeroTelephone: '',
    adresseEntreprise: '',
    adresseCorrespondance: '',
    statutJuridique: '',
    ribIban: '',
    methodesPaiement: ['Carte bancaire', 'Cash'],
  });

  const [isSociété, setIsSociété] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Vérification des champs requis avant envoi
  if (!formData.nomEntreprise || !formData.secteurActivite || !formData.email || !formData.numeroTelephone) {
    alert('Please fill in all required fields');
    return;
  }

  // Récupérer le token
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You are not logged in, please login first');
    return;
  }

  try {
    // Envoi de la requête POST pour créer la société
    const response = await axios.post('http://localhost:5000/api/societes', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Societe added successfully!');
    console.log('Response:', response.data);  // Log de la réponse du serveur
  } catch (error) {
    // Gestion améliorée des erreurs
    if (error.response) {
      console.error('Error response:', error.response);
      alert(`Error: ${error.response.data.message || 'There was an error while adding Societe.'}`);
    } else if (error.request) {
      console.error('Error request:', error.request);
      alert('No response from the server.');
    } else {
      console.error('General Error:', error.message);
      alert(`An error occurred: ${error.message}`);
    }
  }
};


  const handleTypeVendeurChange = (e) => {
    const value = e.target.value;
    setIsSociété(value === 'Société');
    setFormData((prevData) => ({
      ...prevData,
      typeVendeur: value,
      nomEntreprise: value === 'Société' ? prevData.nomEntreprise : '',
      nomVendeur: value === 'Personne physique' ? prevData.nomVendeur : '',
    }));
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card shadow-lg rounded-lg">
            <div className="card-header bg-primary text-white text-center py-4 rounded-top">
              <h3>Create New Societe</h3>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit} className="form-container">
                {/* Type of Vendeur */}
                <div className="mb-4">
                  <label htmlFor="typeVendeur" className="form-label">Type of Vendeur</label>
                  <select
                    id="typeVendeur"
                    name="typeVendeur"
                    className="form-select"
                    value={formData.typeVendeur}
                    onChange={handleTypeVendeurChange}
                    required
                  >
                    <option value="Société">Société</option>
                    <option value="Personne physique">Personne physique</option>
                  </select>
                </div>

                {/* Nom Entreprise (only for Societe) */}
                {isSociété && (
                  <div className="mb-4">
                    <label htmlFor="nomEntreprise" className="form-label">Nom Entreprise</label>
                    <input
                      type="text"
                      id="nomEntreprise"
                      name="nomEntreprise"
                      className="form-control"
                      value={formData.nomEntreprise}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {/* Nom Vendeur (only for Personne physique) */}
                {!isSociété && (
                  <div className="mb-4">
                    <label htmlFor="nomVendeur" className="form-label">Nom Vendeur</label>
                    <input
                      type="text"
                      id="nomVendeur"
                      name="nomVendeur"
                      className="form-control"
                      value={formData.nomVendeur}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {/* Secteur d'Activité */}
                <div className="mb-4">
                  <label htmlFor="secteurActivite" className="form-label">Secteur d'Activité</label>
                  <input
                    type="text"
                    id="secteurActivite"
                    name="secteurActivite"
                    className="form-control"
                    value={formData.secteurActivite}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Numero Telephone */}
                <div className="mb-4">
                  <label htmlFor="numeroTelephone" className="form-label">Numero Telephone</label>
                  <input
                    type="text"
                    id="numeroTelephone"
                    name="numeroTelephone"
                    className="form-control"
                    value={formData.numeroTelephone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success btn-lg">Add Societe</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSocieteForm;
