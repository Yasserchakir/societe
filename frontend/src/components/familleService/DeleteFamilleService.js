import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DeleteFamilleService = ({ id, refreshFamilleServices, showToast }) => {
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/familleservice/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          showToast('FamilleService supprimé avec succès!', 'success');
          refreshFamilleServices();
        } else {
          const errorData = await response.json();
          showToast(`Échec de la suppression : ${errorData.message || 'Erreur inconnue'}`, 'error');
        }
      } catch (error) {
        showToast('Erreur réseau ou serveur indisponible.', 'error');
      }
    }
  };

  return (
    <Button
      variant="outline-danger"
      size="sm"
      className="action-btn"
      onClick={handleDelete}
    >
      <FaTrash /> 
    </Button>
  );
};

export default DeleteFamilleService;