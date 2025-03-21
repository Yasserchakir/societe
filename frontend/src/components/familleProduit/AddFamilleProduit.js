import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";

// Styled Components adaptés de AddFamilleService pour une modal
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  transition: opacity 0.3s ease;

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

const ModalContainer = styled(motion.div)`
  max-width: 500px;
  width: 90%;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-weight: 700;
  font-size: 2rem;
  color: transparent;
  background: linear-gradient(120deg, #2d3748, #4a90e2);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 2px 15px rgba(45, 55, 72, 0.3);
  margin-bottom: 2.5rem;
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
  gap: 2rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled(motion.input)`
  padding: 1rem;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
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
  padding: 1rem;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 120px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const CancelButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: linear-gradient(120deg, #e2e8f0, #cbd5e0);
  color: #4a5568;
  border: none;
  border-radius: 15px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: linear-gradient(120deg, #cbd5e0, #b3c7e8);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: linear-gradient(120deg, #68d391, #38a169);
  color: white;
  border: none;
  border-radius: 15px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(104, 211, 145, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: linear-gradient(120deg, #38a169, #2f855a);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(104, 211, 145, 0.5);
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

const AddFamilleProduit = ({ show, onClose, refreshFamilleProduits }) => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdBy = localStorage.getItem("userId") || "defaultUser";
      const response = await fetch("http://localhost:5000/api/familleproduit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ nom, description, createdBy }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Famille de produit ajoutée avec succès !", {
          position: "top-center",
          autoClose: 2000,
        });
        setNom("");
        setDescription("");
        refreshFamilleProduits();
        onClose();
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

  if (!show) return null;

  return (
    <ModalWrapper show={show} onClick={onClose}>
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Nouvelle Famille de Produits
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
            placeholder="Description détaillée"
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          />
          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={loading}
              whileTap={{ scale: 0.95 }}
            >
              <FaTimes /> Annuler
            </CancelButton>
            <SubmitButton
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Ajouter
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </ModalWrapper>
  );
};

export default AddFamilleProduit;