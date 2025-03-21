// src/UpdateFamilleProduit.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import './FamilleProduitModals.css';

const UpdateFamilleProduit = ({ show, onClose, familleProduit, refreshFamilleProduits }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (familleProduit) {
      setNom(familleProduit.nom || '');
      setDescription(familleProduit.description || '');
    }
  }, [familleProduit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/familleproduit/${familleProduit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nom, description }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      alert('Famille de produit mise à jour avec succès !');
      refreshFamilleProduits();
      onClose();
    } catch (error) {
      alert('Échec de la mise à jour : ' + error.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="custom-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>Modifier Famille de Produit</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nom" className="mb-4">
            <Form.Label className="form-label-custom">Nom</Form.Label>
            <Form.Control
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="form-input-custom"
              placeholder="Entrez le nom"
            />
          </Form.Group>
          <Form.Group controlId="description" className="mb-4">
            <Form.Label className="form-label-custom">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-textarea-custom"
              placeholder="Entrez la description"
            />
          </Form.Group>
          <div className="modal-footer-custom">
            <Button 
              variant="secondary" 
              onClick={onClose}
              className="cancel-btn"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="submit-btn"
            >
              <span className="btn-icon">✏️</span> Mettre à jour
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateFamilleProduit;

