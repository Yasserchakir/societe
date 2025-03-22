import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSortUp, FaSortDown, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import DeleteFamilleService from './DeleteFamilleService';
import './FamilleServiceListe.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FamilleServiceListe = () => {
  const [familleServices, setFamilleServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [filters, setFilters] = useState({ searchTerm: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchFamilleServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/familleservice', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Erreur lors de la récupération des données');
      const data = await response.json();
      setFamilleServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la récupération des familles de services.');
    }
  };

  useEffect(() => {
    fetchFamilleServices();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, familleServices, sortOrder]);

  const applyFiltersAndSort = () => {
    let filtered = [...familleServices];
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.nom.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) =>
      sortOrder === 'asc' ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)
    );
    setFilteredServices(filtered);
  };

  useEffect(() => {
    if (location.state?.updated) {
      toast.success('Famille de service mise à jour avec succès !');
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.added) {
      toast.success('Nouvelle famille de service ajoutée avec succès !');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFamilleService = () => navigate('/admin/familleservice/add');

  const handleEditClick = (service) => {
    setEditingId(service._id);
    setEditFormData({ ...service });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/familleservice/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      const updatedService = await response.json();
      setFamilleServices((prev) =>
        prev.map((service) => (service._id === editingId ? updatedService : service))
      );
      setFilteredServices((prev) =>
        prev.map((service) => (service._id === editingId ? updatedService : service))
      );
      setEditingId(null);
      toast.success('Famille de service mise à jour avec succès');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  return (
    <div className="famille-service-container">
      <div className="controls-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            name="searchTerm"
            placeholder="Rechercher par nom ou description..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="filter-input"
            aria-label="Rechercher par nom ou description"
          />
        </div>
        <button
          className="add-famille-btn"
          onClick={handleAddFamilleService}
          aria-label="Ajouter une nouvelle famille de service"
        >
          <FaPlus className="icon" />
          <span className="btn-text">Ajouter une Famille</span>
        </button>
      </div>

      <div className="recent-orders">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Image</th>
              <th onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                Nom{' '}
                {sortOrder === 'asc' ? (
                  <FaSortUp className="sort-icon" />
                ) : (
                  <FaSortDown className="sort-icon" />
                )}
              </th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              filteredServices.map((familleService, index) => (
                <tr key={familleService._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <td>
                    {familleService.imageUrl ? (
                      <img
                        src={`http://localhost:5000${familleService.imageUrl}`}
                        alt={familleService.nom}
                        className="service-image"
                        onError={(e) => (e.target.src = 'http://localhost:5000/uploads/default.jpg')}
                      />
                    ) : (
                      'Aucune image'
                    )}
                  </td>
                  {editingId === familleService._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="nom"
                          value={editFormData.nom}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleInputChange}
                          className="edit-textarea"
                        />
                      </td>
                      <td className="actions">
                        <button className="action-btn save-btn" onClick={handleSave}>
                          <FaSave />
                        </button>
                        <button className="action-btn cancel-btn" onClick={handleCancel}>
                          <FaTimes />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{familleService.nom}</td>
                      <td>{familleService.description}</td>
                      <td className="actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditClick(familleService)}
                        >
                          <FaEdit />
                        </button>
                        <DeleteFamilleService
                          id={familleService._id}
                          refreshFamilleServices={fetchFamilleServices}
                          showToast={(msg, type) => toast[type](msg)}
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FamilleServiceListe;