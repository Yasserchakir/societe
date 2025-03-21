import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaSave, FaTimes } from "react-icons/fa";

// Styled Components (adapted from ProductForm with centering)
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  display: flex;
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
  max-width: 800px;
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
  display: flex; /* Added to center the form */
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */

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
  width: 100%; /* Ensure form takes full width of container */
  max-width: 500px; /* Optional: Limit form width for better readability */
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const CancelButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  background: linear-gradient(120deg, #e2e8f0, #cbd5e0);
  color: #4a5568;
  border: none;
  border-radius: 15px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
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

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  background: linear-gradient(120deg, #68d391, #38a169);
  color: white;
  border: none;
  border-radius: 15px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(104, 211, 145, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: linear-gradient(120deg, #38a169, #2f855a);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(104, 211, 145, 0.5);
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
    width: 200px;
    height: 200px;
  }
`;

// Animation Variants
const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const AddFamilleService = () => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/familleservice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ nom, description }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Famille de services ajoutée avec succès !", {
          position: "top-center",
          autoClose: 2000,
        });
        setNom("");
        setDescription("");
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
              onClick={() => navigate("/")}
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
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : (
                <FaSave />
              )}
              Enregistrer
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </PageWrapper>
  );
};

export default AddFamilleService;