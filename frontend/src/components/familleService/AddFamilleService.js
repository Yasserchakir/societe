import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled Components avec tailles réduites
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled(motion.div)`
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: transparent;
  background: linear-gradient(120deg, #2d3748, #4a90e2);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 1px 10px rgba(45, 55, 72, 0.3);
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, #4a90e2, transparent);
    animation: underline 2s infinite ease-in-out;
  }

  @keyframes underline {
    0% { width: 0; }
    50% { width: 80px; }
    100% { width: 0; }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled(motion.input)`
  padding: 0.9rem;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.3);
    transform: scale(1.01);
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
  padding: 0.9rem;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.05);
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.3);
    transform: scale(1.01);
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

const DropZone = styled(motion.div)`
  border: 2px dashed ${({ dragActive }) => (dragActive ? "#4a90e2" : "#cbd5e1")};
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  background: ${({ dragActive }) => (dragActive ? "#e6f0fa" : "rgba(255, 255, 255, 0.8)")};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #4a90e2;
    background: #e6f0fa;
    transform: scale(1.01);
  }

  &::after {
    content: "📸";
    font-size: 1.5rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.1;
    pointer-events: none;
  }

  p {
    margin: 0 0 0.75rem 0;
    color: #718096;
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }

  input {
    display: none;
  }
`;

const UploadButton = styled(motion.button)`
  padding: 0.6rem 1.5rem;
  background: linear-gradient(120deg, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 3px 10px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    background: linear-gradient(120deg, #357abd, #2a6399);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MediaPreview = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const MediaItem = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MediaImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(2deg);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const RemoveButton = styled(motion.button)`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(120deg, #f56565, #c53030);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(245, 101, 101, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(120deg, #c53030, #9b2c2c);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 15px rgba(245, 101, 101, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: linear-gradient(120deg, #a0aec0, #718096);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(160, 174, 192, 0.4);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(120deg, #718096, #4a5568);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 15px rgba(160, 174, 192, 0.5);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: linear-gradient(120deg, #68d391, #38a169);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(104, 211, 145, 0.4);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(120deg, #38a169, #2f855a);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 4px 15px rgba(104, 211, 145, 0.5);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Variants pour les animations
const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const AddFamilleService = () => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Aucun token trouvé. Veuillez vous connecter.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    if (image) formData.append('imageUrl', image);

    try {
      const response = await fetch('http://localhost:5000/api/familleservice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Famille de service ajoutée avec succès !", {
          position: "top-center",
          autoClose: 2000,
        });
        setNom('');
        setDescription('');
        setImage(null);
        navigate("/admin/familleservice", { state: { added: true } });
      } else {
        toast.error(`Échec de l'ajout : ${data.message || "Erreur inconnue"}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Erreur réseau ou serveur indisponible.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      toast.error("Vous ne pouvez uploader qu'une seule image.");
      return;
    }
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Seuls les fichiers images sont autorisés.");
      return;
    }
    setImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
      toast.error("Vous ne pouvez uploader qu'une seule image.");
      return;
    }
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Seuls les fichiers images sont autorisés.");
      return;
    }
    setImage(file);
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <ModalWrapper>
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
          Nouvelle Famille de Services
        </Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom de la famille"
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          />
          <DropZone
            dragActive={dragActive}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <p>Glissez une image ou</p>
            <UploadButton
              type="button"
              onClick={handleUploadClick}
              whileTap={{ scale: 0.95 }}
            >
              Upload
            </UploadButton>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </DropZone>
          {image && (
            <MediaPreview
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MediaItem
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <MediaImage src={URL.createObjectURL(image)} alt="Preview" />
                <RemoveButton whileTap={{ scale: 0.95 }} onClick={removeImage}>
                  Supprimer
                </RemoveButton>
              </MediaItem>
            </MediaPreview>
          )}
          <ButtonContainer>
            <CancelButton
              type="button"
              onClick={() => navigate("/admin/familleservice")}
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Annuler
            </CancelButton>
            <SubmitButton
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {loading ? "..." : "Enregistrer"}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </ModalWrapper>
  );
};

export default AddFamilleService;