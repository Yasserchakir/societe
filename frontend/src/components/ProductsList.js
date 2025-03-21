/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Assurez-vous que vous avez importé useHistory

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const history = useHistory(); // Créez un hook history pour la navigation

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    axios
      .delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert('Product deleted successfully!');
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      });
  };

  const handleEdit = (id) => {
    // Naviguer vers la page de mise à jour du produit en utilisant l'ID
    history.push(`/edit-product/${id}`);
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Product List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.nomProduit}</td>
              <td>{product.descriptionProduit}</td>
              <td>{product.prixUnitaire}</td>
              <td>{product.statutProduit}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(product._id)} // Appel à la fonction handleEdit avec l'ID
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
 */