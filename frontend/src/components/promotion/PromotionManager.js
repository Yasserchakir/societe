// src/components/PromotionManager.js
import React, { useState, useEffect } from 'react';
import PromotionForm from './PromotionForm';
import PromotionList from './PromotionList';
import MessageDisplay from './MessageDisplay';
import './PromotionManager.css';

const PromotionManager = () => {
  const [promotions, setPromotions] = useState([]);
  const [formData, setFormData] = useState({
    nomPromotion: '',
    description: '',
    reduction: '',
    dateDebut: '',
    dateFin: '',
    productId: '',
    vendeur: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/promotions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPromotions(data);
    } catch (err) {
      setError('Failed to fetch promotions');
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const resetForm = () => {
    setFormData({
      nomPromotion: '',
      description: '',
      reduction: '',
      dateDebut: '',
      dateFin: '',
      productId: '',
      vendeur: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  return React.createElement(
    'div',
    { className: 'promotion-manager' },
    React.createElement('h1', { className: 'title' }, 'Promotion Manager'),
    React.createElement(PromotionForm, {
      formData,
      setFormData,
      isEditing,
      setIsEditing,
      editId,
      setEditId,
      setError,
      setSuccess,
      fetchPromotions,
      resetForm,
      token
    }),
    React.createElement(MessageDisplay, { error, success }),
    React.createElement(PromotionList, {
      promotions,
      setError,
      setSuccess,
      fetchPromotions,
      setFormData,
      setIsEditing,
      setEditId,
      token
    })
  );
};

export default PromotionManager;