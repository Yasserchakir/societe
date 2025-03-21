import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VendorOrders.css";

function VendorOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Sending request with token:", token);
        const response = await axios.get("http://localhost:5000/api/orders/vendor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.items || response.data); // Handle both formats
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vendor orders:", err);
        setError(err.response?.data?.message || "Failed to load orders. Please try again.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/orders/vendor/update",
        { orderId, vendorStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(order => order._id === orderId ? response.data : order));
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status: " + (error.response?.data?.message || error.message));
    }
  };

  const handleClientClick = (clientId) => {
    navigate(`/profile/${clientId}`);
  };

  const filteredOrders = orders.filter(order =>
    (order.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user?.prenom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.toString().includes(searchTerm)
  );

  return (
    <div className="vendor-orders">
      <h1>Gérer Vos Commandes</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Chargement des commandes...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID Commande</th>
                <th>Client</th>
                <th>Contact</th>
                <th>Ville</th>
                <th>Produits</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8">Aucune commande trouvée pour ce vendeur.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="order-row">
                    <td>{order._id}</td>
                    <td>
                      <span
                        className="client-link"
                        onClick={() => handleClientClick(order.user?._id)}
                        style={{ cursor: "pointer", color: "#2980b9", textDecoration: "underline" }}
                      >
                        {order.user ? `${order.user.name} ${order.user.prenom}` : "Utilisateur inconnu"}
                      </span>
                    </td>
                    <td>{order.user?.telephone || "N/A"}</td>
                    <td>{order.user?.city || "N/A"}</td>
                    <td>
                      {order.products.map(p => (
                        <div key={p.product?._id || p.product}>
                          {p.product ? `${p.product.nomProduit} (x${p.quantity})` : "Produit supprimé"}
                        </div>
                      ))}
                    </td>
                    <td>{order.totalPrice.toFixed(2)} €</td>
                    <td className={`status-${order.vendorStatus.toLowerCase()}`}>
                      {order.vendorStatus}
                    </td>
                    <td>
                      <button
                        className="accept-btn"
                        onClick={() => handleStatusUpdate(order._id, "Accepted")}
                      >
                        Accepter
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusUpdate(order._id, "Rejected")}
                      >
                        Rejeter
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VendorOrders;