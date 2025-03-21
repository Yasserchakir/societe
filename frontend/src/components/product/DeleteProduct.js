import React, { useState } from 'react';
import axios from 'axios';

const DeleteProduct = ({ productId, handleDeleteProduct }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleDeleteProduct(productId);
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  return (
    <>
      <button className="delete-btn" onClick={() => setShowModal(true)}>
        Delete
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Deletion</h2>
            <p className="modal-text">Are you sure you want to delete this product?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteProduct;