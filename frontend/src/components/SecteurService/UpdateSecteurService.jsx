import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./UpdateSecteurService.css";

const UpdateSecteurService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [familleOptions, setFamilleOptions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in first.");
        navigate("/login");
        return;
      }
      try {
        const [serviceRes, familleRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/secteurServices/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/familleServices`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!serviceRes.ok || !familleRes.ok) throw new Error("Failed to fetch data");
        const [serviceData, familleData] = await Promise.all([
          serviceRes.json(),
          familleRes.json(),
        ]);
        setFormData(serviceData);
        setFamilleOptions(familleData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("nomSecteur", formData.nomSecteur);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("familleService", formData.familleService);
    if (imageFile) formDataToSend.append("image", imageFile);
    else if (formData.imageUrl) formDataToSend.append("imageUrl", formData.imageUrl);

    try {
      const response = await fetch(`${API_BASE_URL}/api/secteurServices/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      setNotification("Service updated successfully!");
      setTimeout(() => {
        navigate("/admin/secteurservice");
      }, 2000);
    } catch (err) {
      setError("Failed to update service: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !formData) return <div className="loader"><span className="spinner"></span></div>;

  return (
    <div className="update-secteur-container">
      <h2>Update Secteur Service</h2>
      <form onSubmit={handleSubmit} className="update-service-form">
        <div className="form-group">
          <label>Sector Name</label>
          <input
            type="text"
            name="nomSecteur"
            value={formData.nomSecteur}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <div
            className={`drag-drop-area ${dragActive ? "active" : ""} ${imageFile || formData.imageUrl ? "file-selected" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {imageFile ? (
              <p>{imageFile.name}</p>
            ) : formData.imageUrl ? (
              <img
                src={`${API_BASE_URL}${formData.imageUrl}`}
                alt="Current"
                className="current-image"
              />
            ) : (
              <p>Drag & Drop or Click to Upload Image</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Service Family</label>
          <select
            name="familleService"
            value={formData.familleService}
            onChange={handleChange}
            required
          >
            <option value="">Select Service Family</option>
            {familleOptions.map((famille) => (
              <option key={famille._id} value={famille._id}>
                {famille.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Update"}
          </button>
          <button type="button" onClick={() => navigate("/admin/secteurservice")}>
            Cancel
          </button>
        </div>
      </form>
      {notification && (
        <div className="notification success">
          <FaCheckCircle /> {notification}
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UpdateSecteurService;