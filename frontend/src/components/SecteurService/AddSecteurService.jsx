import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled Components (repris de ProductForm)
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  display: flex;
  margin-left: 250px;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%);
    animation: pulse 10s infinite ease-in-out;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 0.2; }
    100% { transform: scale(1); opacity: 0.5; }
  }
`;

const Container = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: transparent;
  background: linear-gradient(120deg, #2d3748, #4a90e2);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 2px 15px rgba(45, 55, 72, 0.3);
  margin-bottom: 3rem;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #4a90e2, transparent);
    animation: underline 2s infinite ease-in-out;
  }

  @keyframes underline {
    0% { width: 0; }
    50% { width: 100px; }
    100% { width: 0; }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Input = styled(motion.input)`
  padding: 1.25rem;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
  font-size: 1.1rem;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 6px rgba(74, 144, 226, 0.3);
    transform: scale(1.02);
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }

  &:hover:not(:focus) {
    border-color: #b3c7e8;
  }
`;

const Textarea = styled(motion.textarea)`
  padding: 1.25rem;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
  font-size: 1.1rem;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 140px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 6px rgba(74, 144, 226, 0.3);
    transform: scale(1.02);
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }

  &:hover:not(:focus) {
    border-color: #b3c7e8;
  }
`;

const Select = styled(motion.select)`
  padding: 1.25rem;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
  font-size: 1.1rem;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%234a5568" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 1rem center;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 6px rgba(74, 144, 226, 0.3);
    transform: scale(1.02);
    outline: none;
  }

  &:hover:not(:focus) {
    border-color: #b3c7e8;
  }
`;

const DropZone = styled(motion.div)`
  border: 3px dashed ${({ dragActive }) => (dragActive ? "#4a90e2" : "#cbd5e1")};
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  background: ${({ dragActive }) => (dragActive ? "#e6f0fa" : "rgba(255, 255, 255, 0.8)")};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #4a90e2;
    background: #e6f0fa;
    transform: scale(1.02);
  }

  &::after {
    content: "📸";
    font-size: 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.1;
    pointer-events: none;
  }

  p {
    margin: 0 0 1rem 0;
    color: #718096;
    font-family: "Roboto", sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }

  input {
    display: none;
  }
`;

const UploadButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: linear-gradient(120deg, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    background: linear-gradient(120deg, #357abd, #2a6399);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MediaPreview = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
`;

const MediaItem = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MediaImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.15) rotate(2deg);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const RemoveButton = styled(motion.button)`
  margin-top: 0.75rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(120deg, #f56565, #c53030);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(245, 101, 101, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(120deg, #c53030, #9b2c2c);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(245, 101, 101, 0.5);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1.5rem 4rem;
  background: linear-gradient(120deg, #68d391, #38a169);
  color: white;
  border: none;
  border-radius: 20px;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  box-shadow: 0 8px 25px rgba(104, 211, 145, 0.4);
  transition: all 0.3s ease;
  align-self: center;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: linear-gradient(120deg, #38a169, #2f855a);
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 12px 30px rgba(104, 211, 145, 0.5);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease;
  }

  &:hover:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }
`;

const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const AddSecteurService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomSecteur: "",
    description: "",
    familleService: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [familleOptions, setFamilleOptions] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchFamilleServices = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/familleservice`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setFamilleOptions(data);
      } catch (err) {
        toast.error("Failed to fetch famille services: " + err.message);
      }
    };
    fetchFamilleServices();
  }, [navigate]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Seuls les fichiers images sont autorisés.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Seuls les fichiers images sont autorisés.");
    }
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nomSecteur", formData.nomSecteur);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("familleService", formData.familleService);
    if (imageFile) formDataToSend.append("image", imageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/secteurservice`, { // Correction du endpoint
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      toast.success("Service created successfully!");
      setTimeout(() => {
        navigate("/admin/secteurservice");
      }, 2000);
    } catch (err) {
      toast.error("Failed to create service: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ajouter un Secteur de Service
        </Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="nomSecteur"
            value={formData.nomSecteur}
            onChange={handleChange}
            placeholder="Nom du secteur"
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          />
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          />
          <Select
            name="familleService"
            value={formData.familleService}
            onChange={handleChange}
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <option value="">Sélectionnez une famille de services</option>
            {familleOptions.map((famille) => (
              <option key={famille._id} value={famille._id}>
                {famille.nom}
              </option>
            ))}
          </Select>
          <DropZone
            dragActive={dragActive}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <p>{imageFile ? imageFile.name : "Glissez-déposez une image ici ou"}</p>
            <UploadButton
              type="button"
              onClick={handleUploadClick}
              whileTap={{ scale: 0.95 }}
            >
              Upload Directement
            </UploadButton>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </DropZone>
          {imageFile && (
            <MediaPreview
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <MediaItem
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <MediaImage src={URL.createObjectURL(imageFile)} alt="Preview" />
                <RemoveButton whileTap={{ scale: 0.95 }} onClick={removeFile}>
                  Supprimer
                </RemoveButton>
              </MediaItem>
            </MediaPreview>
          )}
          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {isLoading ? "Enregistrement..." : "Ajouter"}
          </SubmitButton>
        </Form>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </PageWrapper>
  );
};

export default AddSecteurService;