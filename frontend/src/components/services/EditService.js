import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './editService.css';

const EditService = ({ service, handleUpdateService, setEditingService }) => {
  const [formData, setFormData] = useState({
    servicename: '',
    description: '',
    price: '',
    availability: '',
    tva: '',
    promotionActive: false,
    reduction: '',
    media: [],
  });

  useEffect(() => {
    setFormData({
      servicename: service.servicename,
      description: service.description,
      price: service.price,
      availability: service.availability,
      tva: service.tva,
      promotionActive: service.promotionActive,
      reduction: service.reduction || '',
      media: Array.isArray(service.media) ? service.media : [],
    });
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'select-multiple') {
      const selectedValues = Array.from(e.target.options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/services/${service._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleUpdateService(response.data);
      setEditingService(null);
      alert('Service modifié avec succès!');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('token');
      } else {
        console.error('Erreur lors de la modification:', error);
        alert('Erreur lors de la modification.');
      }
    }
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  return (
    <div className="edit-societe-container">
      <h2 className="form-title">Modifier un Service</h2>
      <form onSubmit={handleSubmit} className="societe-form">
        <div className="form-group">
          <label>Nom du Service</label>
          <input
            type="text"
            name="servicename"
            value={formData.servicename}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prix (€)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Disponibilité</label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez</option>
            <option value="true">Disponible</option>
            <option value="false">Indisponible</option>
          </select>
        </div>

        <div className="form-group">
          <label>TVA (%)</label>
          <input
            type="number"
            name="tva"
            value={formData.tva}
            onChange={handleChange}
            required
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Promotion Active</label>
          <input
            type="checkbox"
            name="promotionActive"
            checked={formData.promotionActive}
            onChange={handleChange}
          />
        </div>

        {formData.promotionActive && (
          <div className="form-group">
            <label>Réduction (%)</label>
            <input
              type="number"
              name="reduction"
              value={formData.reduction}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>
        )}

        <div className="form-group">
          <label>Média (URLs, sélection multiple)</label>
          <select
            name="media"
            multiple
            value={formData.media}
            onChange={handleChange}
          >
            <option value="url1">url1</option>
            <option value="url2">url2</option>
            <option value="url3">url3</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Mettre à Jour</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default EditService;