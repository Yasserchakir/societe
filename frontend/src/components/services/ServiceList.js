import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSortUp, FaSortDown, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './Service.css';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchName: '',
    availability: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour voir vos services');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error.response ? error.response.data : error.message);
      toast.error('Erreur lors du chargement des services');
    }
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, services, sortOrder]);

  const applyFiltersAndSort = () => {
    let filtered = [...services];

    if (filters.searchName) {
      filtered = filtered.filter((service) =>
        service.servicename.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }
    if (filters.availability) {
      filtered = filtered.filter(
        (service) => service.availability.toLowerCase() === filters.availability.toLowerCase()
      );
    }

    filtered.sort((a, b) =>
      sortOrder === 'asc'
        ? a.servicename.localeCompare(b.servicename)
        : b.servicename.localeCompare(a.servicename)
    );

    setFilteredServices(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }
      const response = await axios.put(
        `http://localhost:5000/api/services/${editingId}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices((prev) =>
        prev.map((service) => (service._id === editingId ? response.data : service))
      );
      setFilteredServices((prev) =>
        prev.map((service) => (service._id === editingId ? response.data : service))
      );
      setEditingId(null);
      toast.success('Service mis à jour avec succès');
    } catch (error) {
      console.error('Error updating service:', error.response ? error.response.data : error.message);
      toast.error('Erreur lors de la mise à jour du service');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices((prev) => prev.filter((service) => service._id !== id));
        setFilteredServices((prev) => prev.filter((service) => service._id !== id));
        toast.success('Service supprimé avec succès');
      } catch (error) {
        console.error('Error deleting service:', error.response ? error.response.data : error.message);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleAddService = () => navigate('/admin/myservices/add');

  return (
    <div className="product-list-container">
      <div className="controls-container" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        {/* Recherche en premier */}
        <div className="search-box" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            name="searchName"
            placeholder="Rechercher par nom..."
            value={filters.searchName}
            onChange={handleFilterChange}
            className="filter-input"
            aria-label="Rechercher des services par nom"
            style={{ flex: 1 }}
          />
        </div>
        {/* Disponibilité au milieu */}
        <select
          name="availability"
          value={filters.availability}
          onChange={handleFilterChange}
          className="filter-select"
          aria-label="Filtrer les services par disponibilité"
        >
          <option value="">Toute Disponibilité</option>
          <option value="ouvert">Ouvert</option>
          <option value="fermé">Fermé</option>
        </select>
        {/* Bouton Ajouter à la fin */}
        <button
          className="add-product-btn"
          onClick={handleAddService}
          aria-label="Ajouter un nouveau service"
        >
          <FaPlus className="icon" />
          <span className="btn-text">Ajouter un Service</span>
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
              <th>Prix Final</th>
              <th>Disponibilité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  Aucun service trouvé
                </td>
              </tr>
            ) : (
              filteredServices.map((service, index) => (
                <tr key={service._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  {editingId === service._id ? (
                    <>
                      <td>
                        {service.media && service.media.length > 0 ? (
                          <img
                            src={`http://localhost:5000${service.media[0]}`}
                            alt={service.servicename}
                            className="product-image"
                            onError={(e) => (e.target.src = 'http://localhost:5000/uploads/default.jpg')}
                          />
                        ) : (
                          'Aucune image'
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          name="servicename"
                          value={editFormData.servicename}
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
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleInputChange}
                          className="edit-input"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td>
                        <select
                          name="availability"
                          value={editFormData.availability.toLowerCase()}
                          onChange={handleInputChange}
                          className="edit-select"
                        >
                          <option value="ouvert">Ouvert</option>
                          <option value="fermé">Fermé</option>
                        </select>
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
                      <td>
                        {service.media && service.media.length > 0 ? (
                          <img
                            src={`http://localhost:5000${service.media[0]}`}
                            alt={service.servicename}
                            className="product-image"
                            onError={(e) => (e.target.src = 'http://localhost:5000/uploads/default.jpg')}
                          />
                        ) : (
                          'Aucune image'
                        )}
                      </td>
                      <td>{service.servicename}</td>
                      <td>{service.description.slice(0, 100)}...</td>
                      <td>{service.finalPrice.toFixed(2)} €</td>
                      <td>
                        <span
                          className={`order-status status-${
                            service.availability.toLowerCase() === 'ouvert' ? 'completed' : 'cancelled'
                          }`}
                        >
                          {service.availability}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditClick(service)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(service._id)}
                        >
                          <FaTrash />
                        </button>
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

export default ServiceList;