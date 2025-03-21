import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSortUp, FaSortDown, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchName: '',
    status: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour voir vos produits');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.response ? error.response.data : error.message);
      toast.error('Erreur lors du chargement des produits');
    }
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, products, sortOrder]);

  const applyFiltersAndSort = () => {
    let filtered = [...products];
    if (filters.searchName) {
      filtered = filtered.filter((product) =>
        product.nomProduit.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }
    if (filters.status) {
      filtered = filtered.filter(
        (product) => product.statutProduit.toLowerCase() === filters.status.toLowerCase()
      );
    }
    filtered.sort((a, b) =>
      sortOrder === 'asc'
        ? a.nomProduit.localeCompare(b.nomProduit)
        : b.nomProduit.localeCompare(a.nomProduit)
    );
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditFormData({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }
      const response = await axios.put(
        `http://localhost:5000/api/products/${editingId}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((product) => (product._id === editingId ? response.data : product))
      );
      setFilteredProducts((prev) =>
        prev.map((product) => (product._id === editingId ? response.data : product))
      );
      setEditingId(null);
      toast.success('Produit mis à jour avec succès');
    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
      toast.error('Erreur lors de la mise à jour du produit');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vous devez être connecté');
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts((prev) => prev.filter((product) => product._id !== id));
        setFilteredProducts((prev) => prev.filter((product) => product._id !== id));
        toast.success('Produit supprimé avec succès');
      } catch (error) {
        console.error('Error deleting product:', error.response ? error.response.data : error.message);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleAddProduct = () => navigate('/admin/add-product');

  return (
    <div className="product-list-container">
      <div className="controls-container" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div className="search-box" style={{ flex: 1 }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            name="searchName"
            placeholder="Rechercher par nom..."
            value={filters.searchName}
            onChange={handleFilterChange}
            className="filter-input"
            aria-label="Rechercher des produits par nom"
          />
        </div>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
          aria-label="Filtrer les produits par statut"
          style={{ width: '150px' }}
        >
          <option value="">Tous les Statuts</option>
          <option value="Disponible">Disponible</option>
          <option value="Epuisé">Epuisé</option>
          <option value="Retiré">Retiré</option>
        </select>
        <button
          className="add-product-btn"
          onClick={handleAddProduct}
          aria-label="Ajouter un nouveau produit"
        >
          <FaPlus className="icon" />
          <span className="btn-text">Ajouter un Produit</span>
        </button>
      </div>

      <div className="recent-orders">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Image</th>
              <th onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                Nom{' '}
                {sortOrder === 'asc' ? (
                  <FaSortUp className="sort-icon" />
                ) : (
                  <FaSortDown className="sort-icon" />
                )}
              </th>
              <th>Description</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  {editingId === product._id ? (
                    <>
                      <td>
                        {product.imageUrl && product.imageUrl.length > 0 ? (
                          <img
                            src={`http://localhost:5000${product.imageUrl[0]}`}
                            alt={product.nomProduit}
                            className="product-image"
                            onError={(e) => (e.target.src = 'http://localhost:5000/uploads/default.jpg')}
                          />
                        ) : (
                          'Aucune image'
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          name="nomProduit"
                          value={editFormData.nomProduit}
                          onChange={handleInputChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <textarea
                          name="descriptionProduit"
                          value={editFormData.descriptionProduit}
                          onChange={handleInputChange}
                          className="edit-textarea"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="prixUnitaire"
                          value={editFormData.prixUnitaire}
                          onChange={handleInputChange}
                          className="edit-input"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td>
                        <select
                          name="statutProduit"
                          value={editFormData.statutProduit}
                          onChange={handleInputChange}
                          className="edit-select"
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="Epuisé">Epuisé</option>
                          <option value="Retiré">Retiré</option>
                        </select>
                      </td>
                      <td className="actions">
                        <button className="action-btn save-btn" onClick={handleSave}>
                          <FaSave />
                        </button>
                        <button className="action-btn cancel-btn" onClick={handleCancel}>
                          <FaTimes />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {product.imageUrl && product.imageUrl.length > 0 ? (
                          <img
                            src={`http://localhost:5000${product.imageUrl[0]}`}
                            alt={product.nomProduit}
                            className="product-image"
                            onError={(e) => (e.target.src = 'http://localhost:5000/uploads/default.jpg')}
                          />
                        ) : (
                          'Aucune image'
                        )}
                      </td>
                      <td>{product.nomProduit}</td>
                      <td>{product.descriptionProduit.slice(0, 100)}...</td>
                      <td>{product.prixUnitaire.toFixed(2)} €</td>
                      <td>
                        <span
                          className={`order-status status-${
                            product.statutProduit.toLowerCase() === 'disponible'
                              ? 'completed'
                              : 'cancelled'
                          }`}
                        >
                          {product.statutProduit}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditClick(product)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(product._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProductList;