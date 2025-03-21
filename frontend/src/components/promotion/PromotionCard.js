// src/components/PromotionCard.js
import React from 'react';

const PromotionCard = ({
  promo,
  setError,
  setSuccess,
  fetchPromotions,
  setFormData,
  setIsEditing,
  setEditId,
  token
}) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/promotions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete promotion');
      setSuccess('Promotion deleted!');
      fetchPromotions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditId(promo._id);
    setFormData({
      nomPromotion: promo.nomPromotion,
      description: promo.description,
      reduction: promo.reduction,
      dateDebut: promo.dateDebut.split('T')[0],
      dateFin: promo.dateFin.split('T')[0],
      productId: promo.product._id,
      vendeur: promo.vendeur
    });
  };

  return React.createElement(
    'div',
    { className: 'promotion-card animate-slide-up' },
    React.createElement('h3', null, promo.nomPromotion),
    React.createElement('p', null, promo.description),
    React.createElement('p', null, `Discount: ${promo.reduction}%`),
    React.createElement('p', null, `Start: ${new Date(promo.dateDebut).toLocaleDateString()}`),
    React.createElement('p', null, `End: ${new Date(promo.dateFin).toLocaleDateString()}`),
    React.createElement('p', null, `Product: ${promo.product?.nomProduit}`),
    React.createElement(
      'div',
      { className: 'card-buttons' },
      React.createElement(
        'button',
        { onClick: handleEdit, className: 'edit-btn' },
        'Edit'
      ),
      React.createElement(
        'button',
        { onClick: () => handleDelete(promo._id), className: 'delete-btn' },
        'Delete'
      )
    )
  );
};

export default PromotionCard;