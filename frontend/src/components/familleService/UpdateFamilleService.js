import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UpdateFamilleService.css';

const UpdateFamilleService = () => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchFamilleService = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/familleservice/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données');
        const data = await response.json();
        setNom(data.nom);
        setDescription(data.description);
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors du chargement des données.', {
          position: "top-right",
          autoClose: 3000,
          style: {
            background: 'linear-gradient(45deg, #f44336, #d32f2f)',
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          },
        });
      }
    };
    fetchFamilleService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/familleservice/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nom, description }),
      });

      if (response.ok) {
        // Show an initial toast and pass success state
        toast.success('FamilleService mis à jour avec succès!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          style: {
            background: 'linear-gradient(45deg, #28a745, #51cf66)',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            fontWeight: '600',
          },
          icon: '🎉',
        });
        navigate('/admin/familleservice', { state: { updated: true } });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour du FamilleService.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: 'linear-gradient(45deg, #f44336, #d32f2f)',
          color: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        },
      });
    }
  };

  return (
    <div className="add-service-page">
      <div className="form-container">
        <h2 className="form-title">Mettre à jour FamilleService</h2>
        <Form onSubmit={handleSubmit} className="elegant-form">
          <Form.Group controlId="nom" className="form-group">
            <Form.Label className="form-label">Nom</Form.Label>
            <Form.Control
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Form.Group controlId="description" className="form-group">
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-input textarea"
            />
          </Form.Group>

          <div className="button-group">
            <Button variant="outline-secondary" className="cancel-btn" onClick={() => navigate('/admin/familleservice')}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" className="save-btn">
              Mettre à jour
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateFamilleService;