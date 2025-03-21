import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./UpdateSecteurProduit.module.css";

function UpdateSecteurProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomSecteur: "",
    description: "",
    imageUrl: null,
    familleProduit: "",
  });
  const [existingImage, setExistingImage] = useState("");
  const [familleProduits, setFamilleProduits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const fetchData = async () => {
      try {
        const [secteurResponse, familleResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/secteurproduits/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/familleproduits", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFormData({
          nomSecteur: secteurResponse.data.nomSecteur || "",
          description: secteurResponse.data.description || "",
          imageUrl: null,
          familleProduit: secteurResponse.data.familleProduit?._id || "",
        });
        setExistingImage(secteurResponse.data.imageUrl || "");
        setFamilleProduits(familleResponse.data);
      } catch (err) {
        setError("Failed to fetch data.");
        if (err.response?.status === 404) navigate("/admin/secteurproduit");
      }
    };
    fetchData();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, imageUrl: file });
      setExistingImage("");
    } else {
      setError("Please upload an image file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, imageUrl: file });
      setExistingImage("");
    } else {
      setError("Please upload an image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    if (!formData.nomSecteur || !formData.description || !formData.familleProduit) {
      setError("Name, description, and product family are required.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("nomSecteur", formData.nomSecteur);
      data.append("description", formData.description);
      data.append("familleProduit", formData.familleProduit);
      if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);
      else if (existingImage) data.append("imageUrl", existingImage);

      await axios.put(`http://localhost:5000/api/secteurproduits/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/secteurproduit?updated=true");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product sector.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Update Sector</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nomSecteur"
            value={formData.nomSecteur}
            onChange={handleChange}
            placeholder="Sector Name"
            className={styles.input}
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className={styles.textarea}
            required
          />
          <select
            name="familleProduit"
            value={formData.familleProduit}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select a Product Family</option>
            {familleProduits.map((fp) => (
              <option key={fp._id} value={fp._id}>
                {fp.nom}
              </option>
            ))}
          </select>
          <div
            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>
              <FontAwesomeIcon icon={faUpload} /> Drop a new image or click to select
            </p>
            <input
              type="file"
              name="imageUrl"
              onChange={handleFileChange}
              accept="image/*"
              className={styles.fileInput}
            />
          </div>
          {(existingImage || formData.imageUrl) && (
            <div className={styles.preview}>
              <div className={styles.previewItem}>
                <img
                  src={
                    formData.imageUrl
                      ? URL.createObjectURL(formData.imageUrl)
                      : `http://localhost:5000${existingImage}`
                  }
                  alt="Preview"
                  className={styles.previewImage}
                  onError={(e) => (e.target.src = "http://localhost:5000/uploads/default.jpg")}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => {
                    setFormData({ ...formData, imageUrl: null });
                    setExistingImage("");
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          )}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Updating..." : "Update Sector"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateSecteurProduit;