import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Importez useNavigate

const UpdateProduct = () => {
  const [formData, setFormData] = useState({
    nomProduit: '',
    descriptionProduit: '',
    prixUnitaire: '',
    tva: '0',
    quantiteDisponible: '',
    imageUrl: '',
    promotionActive: false,
    reduction: '',
    statutProduit: 'Disponible',
    idFamille: '',
  });
  const [familleProduits, setFamilleProduits] = useState([]);

  const { id } = useParams(); // Récupérer l'ID du produit
  const navigate = useNavigate(); // Utilisation de useNavigate

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });

    axios
      .get('http://localhost:5000/api/familleproduit', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setFamilleProduits(response.data);
      })
      .catch((error) => {
        console.error('Error fetching family products:', error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${formData._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Product updated successfully!');
      navigate('/'); // Redirige vers la liste des produits après la mise à jour
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Update Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Form Fields (same as AddProduct) */}
        {/* ... */}
        <button type="submit" className="btn btn-primary btn-lg w-100">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
