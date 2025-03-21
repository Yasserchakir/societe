import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTrash, FaEdit, FaSortUp, FaSortDown, FaPlus } from "react-icons/fa";
import "./ListSecteurService.css";

const ListSecteurService = () => {
  const navigate = useNavigate();
  const [secteurServices, setSecteurServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "nomSecteur", direction: "asc" });
  const [notification, setNotification] = useState(null);
  const API_BASE_URL = "http://localhost:5000";

  const fetchSecteurServices = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in first.");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/secteurservice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setSecteurServices(data);
    } catch (err) {
      setError("Failed to fetch services: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecteurServices();
  }, [navigate]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...secteurServices].sort((a, b) => {
      if (key === "familleService") {
        const aValue = a.familleService?.nom || "Unknown";
        const bValue = b.familleService?.nom || "Unknown";
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      const aValue = a[key] || "";
      const bValue = b[key] || "";
      return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setSecteurServices(sortedData);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/secteurservice/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        setNotification("Service deleted successfully!");
        fetchSecteurServices();
        setTimeout(() => setNotification(null), 2000);
      } catch (err) {
        setError("Failed to delete service: " + err.message);
      }
    }
  };

  return (
    <div className="product-list-container">
      <div className="controls-container" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <button
          className="add-product-btn"
          onClick={() => navigate("/admin/secteurservice/new")}
          aria-label="Ajouter un nouveau secteur de service"
        >
          <FaPlus className="icon" />
          <span className="btn-text">Ajouter un Secteur</span>
        </button>
      </div>

      <div className="recent-orders">
        {isLoading ? (
          <div className="no-data">Chargement en cours...</div>
        ) : error ? (
          <div className="no-data">{error}</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Image</th>
                <th onClick={() => handleSort("nomSecteur")}>
                  Nom{" "}
                  {sortConfig.key === "nomSecteur" &&
                    (sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />)}
                </th>
                <th onClick={() => handleSort("description")}>
                  Description{" "}
                  {sortConfig.key === "description" &&
                    (sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />)}
                </th>
                <th onClick={() => handleSort("familleService")}>
                  Famille{" "}
                  {sortConfig.key === "familleService" &&
                    (sortConfig.direction === "asc" ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />)}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {secteurServices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    Aucun secteur de service trouvé
                  </td>
                </tr>
              ) : (
                secteurServices.map((service, index) => (
                  <tr key={service._id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <td>
                      {service.imageUrl ? (
                        <img
                          src={`${API_BASE_URL}${service.imageUrl}`}
                          alt={service.nomSecteur}
                          className="product-image"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/60")}
                        />
                      ) : (
                        "Aucune image"
                      )}
                    </td>
                    <td>{service.nomSecteur}</td>
                    <td>{service.description.slice(0, 100)}...</td>
                    <td>{service.familleService?.nom || "Inconnu"}</td>
                    <td className="actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => navigate(`/admin/secteurservice/${service._id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(service._id)}>
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

      {notification && (
        <div className="notification">
          <FaCheckCircle /> {notification}
        </div>
      )}
    </div>
  );
};

export default ListSecteurService;