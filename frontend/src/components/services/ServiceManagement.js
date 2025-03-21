import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceList from './ServiceList';  // Import the ServiceList component
import EditService from './EditService'; // Import the EditService component
import DeleteService from './DeleteService'; // Import the DeleteService component

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  // Fetch services from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/services', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => setServices(response.data))
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  // Update service (triggered by EditService)
  const handleUpdateService = (updatedService) => {
    axios
      .put(`http://localhost:5000/api/services/${updatedService._id}`, updatedService, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setServices((prevServices) =>
          prevServices.map((service) =>
            service._id === updatedService._id ? updatedService : service
          )
        );
        setEditingService(null); // Reset the editing state
      })
      .catch((error) => console.error('Error updating service:', error));
  };

  // Delete service (triggered by DeleteService)
  const handleDeleteService = (serviceId) => {
    axios
      .delete(`http://localhost:5000/api/services/${serviceId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        setServices((prevServices) => prevServices.filter((service) => service._id !== serviceId));
      })
      .catch((error) => console.error('Error deleting service:', error));
  };

  return (
    <div>
      <ServiceList
        services={services}
        setEditingService={setEditingService}
        handleDeleteService={handleDeleteService}
      />
      {editingService && (
        <EditService
          service={editingService}
          handleUpdateService={handleUpdateService}
          setEditingService={setEditingService}
        />
      )}
    </div>
  );
};

export default ServiceManagement;
