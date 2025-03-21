import React, { useState, useEffect } from "react";
import { FaSortUp, FaSortDown, FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import AddFamilleProduit from "./AddFamilleProduit";
import DeleteFamilleProduit from "./DeleteFamilleProduit";
import "./FamilleProduitListe.css";

const FamilleProduitListe = () => {
  const [familleProduits, setFamilleProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduitId, setEditingProduitId] = useState(null);
  const [editValues, setEditValues] = useState({ nom: "", description: "" });
  const [filters, setFilters] = useState({ searchTerm: "" });

  const fetchFamilleProduits = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/familleproduit", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setFamilleProduits(data);
      setFilteredProduits(data);
    } catch (error) {
      console.error("Erreur:", error);
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
    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)
    );
    setFilteredProduits(filtered);
  };

  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const response = await fetch(`http://localhost:5000/api/familleproduit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editValues),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      fetchFamilleProduits();
      setEditingProduitId(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleCancel = () => {
    setEditingProduitId(null);
    setEditValues({ nom: "", description: "" });
  };

  const handleAddFamilleProduit = () => {
    console.log("Bouton cliqué, ouverture de la modale"); // Pour déboguer
    setShowAddModal(true);
  };

  return (
    <div className="famille-produit-container">
      <div className="controls-container" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <div className="search-box" style={{ flex: 1 }}>
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
                <td colSpan="3" className="no-data">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              filteredProduits.map((familleProduit, index) => (
                <tr key={familleProduit._id} style={{ animationDelay: `${index * 0.1}s` }}>
                  {editingProduitId === familleProduit._id ? (
                    <>
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
                        <button
                          className="action-btn save-btn"
                          onClick={() => handleEditSave(familleProduit._id)}
                        >
                          <FaSave />
                        </button>
                        <button className="action-btn cancel-btn" onClick={handleCancel}>
                          <FaTimes />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{familleProduit.nom}</td>
                      <td>{familleProduit.description}</td>
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
                        <DeleteFamilleProduit
                          id={familleProduit._id}
                          refreshFamilleProduits={fetchFamilleProduits}
                        />
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
    </div>
  );
};

export default FamilleProduitListe;