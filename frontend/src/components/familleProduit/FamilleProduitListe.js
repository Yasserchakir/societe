import React, { useState, useEffect } from "react";
import { FaSortUp, FaSortDown, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import AddFamilleProduit from "./AddFamilleProduit";
import DeleteFamilleProduit from "./DeleteFamilleProduit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./FamilleProduitListe.css";

const FamilleProduitListe = () => {
  const [familleProduits, setFamilleProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduitId, setEditingProduitId] = useState(null);
  const [editValues, setEditValues] = useState({ nom: "", description: "" });
  const [filters, setFilters] = useState({
    searchTerm: "",
    categoryFilter: "",
  });
  const [categories, setCategories] = useState([]);

  const fetchFamilleProduits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Vous devez être connecté pour voir les familles de produits');
        return;
      }
      const response = await fetch("http://localhost:5000/api/familleproduit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setFamilleProduits(data);
      setFilteredProduits(data);
      const uniqueCategories = [...new Set(data.map((p) => p.nom))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error('Erreur lors du chargement des familles de produits');
    }
  };

  useEffect(() => {
    fetchFamilleProduits();
  }, []);

  const applyFiltersAndSort = () => {
    let filtered = [...familleProduits];
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nom?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.categoryFilter) {
      filtered = filtered.filter((p) => p.nom === filters.categoryFilter);
    }
    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)
    );
    setFilteredProduits(filtered);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, familleProduits, sortOrder]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e, field) => {
    const { value } = e.target;
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/familleproduit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editValues),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      fetchFamilleProduits();
      setEditingProduitId(null);
      toast.success('Famille de produit mise à jour avec succès');
    } catch (error) {
      console.error("Erreur:", error);
      toast.error('Erreur lors de la mise à jour de la famille de produit');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduitId(null);
    setEditValues({ nom: "", description: "" });
  };

  const handleAddFamilleProduit = () => setShowAddModal(true);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('Vous devez être connecté');
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette famille de produit ?')) {
      try {
        await fetch(`http://localhost:5000/api/familleproduit/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchFamilleProduits();
        toast.success('Famille de produit supprimée avec succès');
      } catch (error) {
        console.error("Erreur:", error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const truncateDescription = (description) => {
    if (!description) return "";
    return description.length > 100 ? `${description.slice(0, 100)}...` : description;
  };

  return (
    <div className="famille-produit-container">
      <div className="controls-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            name="searchTerm"
            placeholder="Rechercher par nom ou description..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="filter-input"
            aria-label="Rechercher par nom ou description"
          />
        </div>
        <select
          name="categoryFilter"
          value={filters.categoryFilter}
          onChange={handleFilterChange}
          className="filter-input"
          aria-label="Filtrer par catégorie"
        >
          <option value="">Toutes catégories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          className="add-famille-btn"
          onClick={handleAddFamilleProduit}
          aria-label="Ajouter une nouvelle famille de produit"
        >
          <FaPlus className="icon" />
          <span className="btn-text">Ajouter une Famille</span>
        </button>
      </div>

      <div className="recent-orders">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Image</th>
              <th onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                Nom{" "}
                {sortOrder === "asc" ? (
                  <FaSortUp className="sort-icon" />
                ) : (
                  <FaSortDown className="sort-icon" />
                )}
              </th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduits.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              filteredProduits.map((familleProduit, index) => (
                <tr key={familleProduit._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  {editingProduitId === familleProduit._id ? (
                    <>
                      <td>
                        {familleProduit.imageUrl ? (
                          <img
                            src={`http://localhost:5000${familleProduit.imageUrl}`}
                            alt={familleProduit.nom}
                            className="produit-image"
                            onError={(e) => (e.target.src = "http://localhost:5000/uploads/default.jpg")}
                          />
                        ) : (
                          "Aucune image"
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          name="nom"
                          value={editValues.nom}
                          onChange={(e) => handleEditChange(e, "nom")}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <textarea
                          name="description"
                          value={editValues.description}
                          onChange={(e) => handleEditChange(e, "description")}
                          className="edit-textarea"
                        />
                      </td>
                      <td className="actions">
                        <button className="action-btn save-btn" onClick={() => handleEditSave(familleProduit._id)}>
                          <FaSave />
                        </button>
                        <button className="action-btn cancel-btn" onClick={handleCancelEdit}>
                          <FaTimes />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {familleProduit.imageUrl ? (
                          <img
                            src={`http://localhost:5000${familleProduit.imageUrl}`}
                            alt={familleProduit.nom}
                            className="produit-image"
                            onError={(e) => (e.target.src = "http://localhost:5000/uploads/default.jpg")}
                          />
                        ) : (
                          "Aucune image"
                        )}
                      </td>
                      <td>{familleProduit.nom}</td>
                      <td>{truncateDescription(familleProduit.description)}</td>
                      <td className="actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setEditingProduitId(familleProduit._id);
                            setEditValues({
                              nom: familleProduit.nom,
                              description: familleProduit.description,
                            });
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(familleProduit._id)}
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

      <AddFamilleProduit
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshFamilleProduits={fetchFamilleProduits}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FamilleProduitListe;