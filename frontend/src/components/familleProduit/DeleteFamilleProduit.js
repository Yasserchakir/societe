// src/DeleteFamilleProduit.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const DeleteFamilleProduit = ({ id, refreshFamilleProduits }) => {
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/api/familleproduit/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Using token-based auth
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert('FamilleProduit deleted successfully!');
      refreshFamilleProduits();
    } else {
      alert('Failed to delete FamilleProduit.');
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      <FaTrash/>
    </Button>
  );
};

export default DeleteFamilleProduit;
