import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate pour React Router v6

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Utilisation de useNavigate au lieu de useHistory

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    axios
      .get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    axios
      .delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Product deleted successfully!");
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      });
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`); // Utilisation correcte de navigate
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Product List</h2>
      <table className="table table-striped">
        <thead className="table-dark">
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
                  className="btn btn-warning mx-1"
                  onClick={() => handleEdit(product._id)}
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
