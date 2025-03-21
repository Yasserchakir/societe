import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './product.css'; // Your custom CSS

const AddProduct = () => {
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
    idFamille: '', // Family reference
  });

  const [familleProduits, setFamilleProduits] = useState([]);

  // Fetch available families from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/familleproduit', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        console.log('Fetched Family Products:', response.data);
        setFamilleProduits(response.data);
      })
      .catch((error) =>
        console.error('Error fetching family products:', error)
      );
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.nomProduit ||
    !formData.descriptionProduit ||
    !formData.prixUnitaire ||
    !formData.tva ||
    !formData.idFamille
  ) {
    alert('Please fill in all required fields.');
    return;
  }

  const dataToSend = {
    ...formData,
    prixUnitaire: Number(formData.prixUnitaire),
    tva: Number(formData.tva),
    reduction: formData.reduction ? Number(formData.reduction) : 0,
    quantiteDisponible: formData.quantiteDisponible ? Number(formData.quantiteDisponible) : 0, // Ajouté
  };

  console.log('Data being sent:', dataToSend); // Ajoutez ceci pour déboguer

  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/products', dataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Product added successfully!');
    console.log('Response:', response.data);
    setFormData({
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
  } catch (error) {
    console.error('Error adding product:', error.response?.data || error); // Affichez la réponse du serveur
    alert('Error adding product: ' + (error.response?.data?.message || 'Unknown error'));
  }
};
  return (
    <div className="container">
      <h2 className="text-center my-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="form-container">
        {/* Product Name */}
        <div className="mb-3">
          <label htmlFor="nomProduit" className="form-label">Product Name</label>
          <input
            type="text"
            id="nomProduit"
            name="nomProduit"
            className="form-control"
            value={formData.nomProduit}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="descriptionProduit" className="form-label">Description</label>
          <textarea
            id="descriptionProduit"
            name="descriptionProduit"
            className="form-control"
            value={formData.descriptionProduit}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Unit Price */}
        <div className="mb-3">
          <label htmlFor="prixUnitaire" className="form-label">Unit Price</label>
          <input
            type="number"
            id="prixUnitaire"
            name="prixUnitaire"
            className="form-control"
            value={formData.prixUnitaire}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* TVA */}
        <div className="mb-3">
          <label htmlFor="tva" className="form-label">TVA</label>
          <select
            id="tva"
            name="tva"
            className="form-control"
            value={formData.tva}
            onChange={handleInputChange}
            required
          >
            <option value="0">0%</option>
            <option value="7">7%</option>
            <option value="13">13%</option>
            <option value="19">19%</option>
          </select>
        </div>

        {/* Promotion Active */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="promotionActive"
            name="promotionActive"
            className="form-check-input"
            checked={formData.promotionActive}
            onChange={handleInputChange}
          />
          <label htmlFor="promotionActive" className="form-check-label">Promotion Active</label>
        </div>

        {/* Reduction (if promotion is active) */}
        {formData.promotionActive && (
          <div className="mb-3">
            <label htmlFor="reduction" className="form-label">Reduction (%)</label>
            <input
              type="number"
              id="reduction"
              name="reduction"
              className="form-control"
              value={formData.reduction}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
          </div>
        )}

        {/* Product Status */}
        <div className="mb-3">
          <label htmlFor="statutProduit" className="form-label">Product Status</label>
          <select
            id="statutProduit"
            name="statutProduit"
            className="form-control"
            value={formData.statutProduit}
            onChange={handleInputChange}
            required
          >
            <option value="Disponible">Disponible</option>
            <option value="Epuisé">Epuisé</option>
            <option value="Retiré">Retiré</option>
          </select>
        </div>

        {/* Family Dropdown */}
        <div className="mb-3">
          <label htmlFor="idFamille" className="form-label">Product Family</label>
          <select
            id="idFamille"
            name="idFamille"
            className="form-control"
            value={formData.idFamille}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Family</option>
            {familleProduits.length > 0 ? (
              familleProduits.map(famille => (
                <option key={famille._id} value={famille._id}>
                  {famille.nom}
                </option>
              ))
            ) : (
              <option value="">No Families Available</option>
            )}
          </select>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
