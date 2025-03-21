// ServiceCard.jsx
import React from 'react';

function ServiceCard({ service, onEdit, onDelete }) {
  const handleEdit = () => {
    onEdit(service);
  };

  const handleDelete = () => {
    onDelete(service._id);
  };

  return (
    <div className="service-card">
      <h3>{service.servicename}</h3>
      <p><strong>Description:</strong> {service.description}</p>
      <p><strong>Availability:</strong> {service.availability}</p>
      <p><strong>Price:</strong> ${service.price}</p>
      <p><strong>TVA:</strong> {service.tva}%</p>
      <p><strong>Price Total:</strong> ${service.priceTotal}</p>
      <p><strong>Final Price:</strong> ${service.finalPrice}</p>
      <p><strong>State:</strong> {service.state}</p>
      <div>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default ServiceCard;
