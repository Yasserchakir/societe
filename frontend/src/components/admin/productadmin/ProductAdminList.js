import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import './productAdminList.css';

const MyProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setFormVisible(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    try {
      const { _id, ...updatedProduct } = selectedProduct;
      const response = await axios.put(
        `http://localhost:5000/api/products/${_id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.map((prod) => (prod._id === _id ? response.data : prod)));
      setFormVisible(false);
      alert("Product updated successfully!");
    } catch (err) {
      setError("Error updating product");
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const mediaArray = Array.from(files).map((file) => URL.createObjectURL(file));
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      media: [...(prevProduct.media || []), ...mediaArray],
    }));
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'media',
      headerName: 'Media',
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.media && params.row.media.length > 0 ? params.row.media[0] : '/noavatar.png'}
          alt=""
          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
        />
      ),
    },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 120, type: 'number' },
    { field: 'quantity', headerName: 'Quantity', width: 120, type: 'number' },
    {
      field: 'createdBy',
      headerName: 'Seller',
      width: 150,
      renderCell: (params) => params.row.createdBy ? params.row.createdBy.name : 'Unknown',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className="actions">
          <button onClick={() => handleUpdateClick(params.row)} className="btn-update">
            Update
          </button>
          <button onClick={() => handleDelete(params.row._id)} className="btn-delete">
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-list">
      <div className="info">
        <h1>Products</h1>
        <button onClick={() => setFormVisible(true)} className="btn-add">Add New Product</button>
      </div>
      <DataGrid
        rows={products}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        className="data-table"
      />
      {formVisible && (
        <div className="update-form-container">
          <form className="update-form" onSubmit={handleUpdateSubmit}>
            <h2>{selectedProduct ? 'Update Product' : 'Add Product'}</h2>
            <label>Name:</label>
            <input
              type="text"
              value={selectedProduct?.name || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
            />
            <label>Description:</label>
            <textarea
              value={selectedProduct?.description || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
            />
            <label>Price:</label>
            <input
              type="number"
              value={selectedProduct?.price || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
            />
            <label>Quantity:</label>
            <input
              type="number"
              value={selectedProduct?.quantity || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
            />
            <label>Media:</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
            <div className="media-preview">
              {selectedProduct?.media?.length > 0 && (
                selectedProduct.media.map((media, index) => (
                  <div key={index} className="media-item">
                    <img src={media} alt={`Media ${index}`} className="media-thumbnail" />
                  </div>
                ))
              )}
            </div>
            <button type="submit" className="btn-save">Save</button>
            <button type="button" onClick={() => setFormVisible(false)} className="btn-cancel">Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyProductsList;