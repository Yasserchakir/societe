import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSortUp, FaSortDown, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./ListSecteurProduit.module.css";

function SecteurProduitListe() {
  const [secteurProduits, setSecteurProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "nomSecteur", direction: "asc" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchSecteurProduits = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/secteurproduits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecteurProduits(response.data);
        setLoading(false);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("created")) {
          showNotification("Product sector created successfully!", "success");
          window.history.replaceState({}, document.title, "/admin/secteurproduit");
        } else if (urlParams.get("updated")) {
          showNotification("Product sector updated successfully!", "warning");
          window.history.replaceState({}, document.title, "/admin/secteurproduit");
        }
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Unauthorized. Please log in again."
            : "Failed to fetch product sectors."
        );
        setLoading(false);
      }
    };
    fetchSecteurProduits();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product sector?")) {
      try {
        await axios.delete(`http://localhost:5000/api/secteurproduits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecteurProduits(secteurProduits.filter((sp) => sp._id !== id));
        showNotification("Product sector deleted successfully!", "error");
      } catch (err) {
        setError("Failed to delete product sector.");
      }
    }
  };

  const showNotification = (message, type) => {
    const notificationDiv = document.createElement("div");
    notificationDiv.className = `notification ${type}`;
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);
    setTimeout(() => notificationDiv.remove(), 3000);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedArray = [...secteurProduits].sort((a, b) => {
      if (key === "familleProduit") {
        const aValue = a.familleProduit?.nom || "N/A";
        const bValue = b.familleProduit?.nom || "N/A";
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      const aValue = a[key] || "";
      const bValue = b[key] || "";
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    setSecteurProduits(sortedArray);
  };

  return (
    <div className="product-list-container">
      <div className="controls-container" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <button
          className="add-product-btn"
          onClick={() => navigate("/admin/secteurproduit/new")}
          aria-label="Ajouter un nouveau secteur de produit"
        >
          <FaPlus className="icon" />
          <span className="btn-text">Ajouter un Secteur</span>
        </button>
      </div>

      <div className="recent-orders">
        {loading ? (
          <div className="no-data">Chargement en cours...</div>
        ) : error ? (
          <div className="no-data">{error}</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Image</th>
                <th onClick={() => requestSort("nomSecteur")}>
                  Nom{" "}
                  {sortConfig.key === "nomSecteur" &&
                    (sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />)}
                </th>
                <th onClick={() => requestSort("description")}>
                  Description{" "}
                  {sortConfig.key === "description" &&
                    (sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />)}
                </th>
                <th onClick={() => requestSort("familleProduit")}>
                  Famille{" "}
                  {sortConfig.key === "familleProduit" &&
                    (sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />)}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {secteurProduits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    Aucun secteur de produit trouvé
                  </td>
                </tr>
              ) : (
                secteurProduits.map((sp, index) => (
                  <tr key={sp._id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <td>
                      {sp.imageUrl ? (
                        <img
                          src={`http://localhost:5000${sp.imageUrl}`}
                          alt={sp.nomSecteur}
                          className="product-image"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/60")}
                        />
                      ) : (
                        "Aucune image"
                      )}
                    </td>
                    <td>{sp.nomSecteur}</td>
                    <td>{sp.description.slice(0, 100)}...</td>
                    <td>{sp.familleProduit?.nom || "N/A"}</td>
                    <td className="actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => navigate(`/admin/secteurproduit/${sp._id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(sp._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SecteurProduitListe;