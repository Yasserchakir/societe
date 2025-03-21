import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProduct = ({ product, handleUpdateProduct, setEditingProduct }) => {
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/api/products/${product._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product updated successfully!');
      handleUpdateProduct(response.data);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  return (
    <div className="create-societe-container">
      <h2 className="form-title">Edit Product</h2>
      <form onSubmit={handleSubmit} className="societe-form">
        <div className="form-group">
          <label>Product Name</label>
          <input type="text" name="nomProduit" className="form-input" value={formData.nomProduit} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="descriptionProduit" className="form-input" value={formData.descriptionProduit} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Price (€)</label>
          <input type="number" name="prixUnitaire" className="form-input" value={formData.prixUnitaire} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="statutProduit" className="form-input" value={formData.statutProduit} onChange={handleInputChange} required>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Update</button>
          <button type="button" className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;