import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './service.css';
import EditService from './EditService';
import DeleteService from './DeleteService';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [editingService, setEditingServiceState] = useState(null);
  
  // Filter states
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [searchName, setSearchName] = useState('');
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/services', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setServices(response.data);
        setFilteredServices(response.data);
      })
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  // Filtering function
  useEffect(() => {
    let filtered = [...services]; // Create a copy to avoid mutating state directly

    if (category) {
      filtered = filtered.filter(service => 
        service.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(service => service.price >= parseFloat(minPrice));
    }

    if (searchName) {
      filtered = filtered.filter(service => 
        service.servicename.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (availability !== '') {
      filtered = filtered.filter(service => service.availability === availability);
    }

    setFilteredServices(filtered);
  }, [category, minPrice, searchName, availability, services]);

  const handleSetEditingService = (service) => {
    setEditingServiceState(service);
  };

  const handleCancelEditing = () => {
    setEditingServiceState(null);
  };

  const handleDeleteService = (serviceId) => {
    setServices((prevServices) => prevServices.filter((service) => service._id !== serviceId));
    setFilteredServices((prevFiltered) => prevFiltered.filter((service) => service._id !== serviceId));
  };

  return (
    <div className="service-container">
      <h2 className="service-title">Our Services</h2>
      
      {/* Filters */}
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search by Name" 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Min Price (€)" 
          value={minPrice} 
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <select 
          value={availability} 
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="">All</option>
          <option value="ouvert">Available</option>
          <option value="fermé">Unavailable</option>
        </select>
      </div>

      <div className="service-grid">
        <table className="service-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Availability</th>
              <th>TVA</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service._id} className="service-row">
                <td>{service.servicename}</td>
                <td>{service.category}</td>
                <td>{service.description}</td>
                <td>€{service.price}</td>
                <td>{service.availability === 'ouvert' ? 'Available' : 'Unavailable'}</td>
                <td>{service.tva}%</td>
                <td>{service.reduction || '0'}%</td>
                <td className="card-actions">
                  <button className="edit-btn" onClick={() => handleSetEditingService(service)}>Edit</button>
                  <DeleteService serviceId={service._id} handleDeleteService={handleDeleteService} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingService && (
        <EditService
          service={editingService}
          handleUpdateService={handleSetEditingService}
          setEditingService={handleCancelEditing}
        />
      )}
    </div>
  );
};

export default ServiceList;