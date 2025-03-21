import React, { useState } from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';
import './DeleteService.css'; // Use service.css for styles
import { FaTrash } from 'react-icons/fa';

const DeleteService = ({ serviceId, handleDeleteService }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteService = () => {
    axios
      .delete(`http://localhost:5000/api/services/${serviceId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        handleDeleteService(serviceId);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting service:', error);
        setIsModalOpen(false);
      });
  };

  // Modal content to be portaled
  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Confirmer la suppression</h3>
        <p className="modal-text">
          Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
        </p>
        <div className="modal-buttons">
          <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
            Annuler
          </button>
          <button onClick={deleteService} className="confirm-btn">
            Oui, supprimer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="delete-btn">
        <FaTrash/>
      </button>

      {isModalOpen && createPortal(modalContent, document.body)}
    </>
  );
};

export default DeleteService;