import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled Components avec animations
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

const Form = styled(motion.form)`
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

  &:disabled {
    background: #edf2f7;
    color: #a0aec0;
    cursor: not-allowed;
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: #b3c7e8;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: "Roboto", sans-serif;
  font-size: 1.1rem;
  color: #2d3748;
`;

const Checkbox = styled.input`
  width: 1.5rem;
  height: 1.5rem;
  accent-color: #4a90e2;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
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

const Error = styled(motion.p)`
  color: #e53e3e;
  font-size: 1rem;
  font-weight: 500;
  font-family: "Roboto", sans-serif;
  text-align: center;
  margin-bottom: 1.5rem;
  background: rgba(254, 226, 226, 0.9);
  padding: 0.8rem;
  border-radius: 10px;
`;

const LoginButton = styled(motion.button)`
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
  margin-top: 1rem;
  align-self: center;

  &:hover {
    background: linear-gradient(120deg, #357abd, #2a6399);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MaxFilesText = styled(motion.p)`
  color: #e53e3e;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.75rem;
  text-align: center;
`;

const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

function AddServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    servicename: "",
    description: "",
    availability: "ouvert",
    price: "",
    tva: "0",
    promotionActive: false,
    reduction: "",
    state: "à faire",
    media: [],
    idFamille: "",
    idSecteur: "",
  });
  const [familleServices, setFamilleServices] = useState([]);
  const [secteurServices, setSecteurServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Aucun jeton trouvé. Veuillez vous connecter.");
      return;
    }

    const fetchFamilleServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/familleservice", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFamilleServices(response.data);
      } catch (err) {
        setError("Échec du chargement des familles de services.");
      }
    };

    fetchFamilleServices();

    if (id && id !== "new") {
      const fetchService = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/services/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const serviceData = response.data;
          setFormData({
            servicename: serviceData.servicename || "",
            description: serviceData.description || "",
            availability: serviceData.availability || "ouvert",
            price: serviceData.price?.toString() || "",
            tva: serviceData.tva?.toString() || "0",
            promotionActive: serviceData.promotionActive || false,
            reduction: serviceData.reduction?.toString() || "",
            state: serviceData.state || "à faire",
            media: serviceData.media || [],
            idFamille: serviceData.idFamille?._id || serviceData.idFamille || "",
            idSecteur: serviceData.idSecteur?._id || serviceData.idSecteur || "",
          });

          if (serviceData.idFamille) {
            const secteurResponse = await axios.get(
              `http://localhost:5000/api/secteurservice/famille/${serviceData.idFamille}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setSecteurServices(secteurResponse.data);
          }
        } catch (err) {
          setError("Échec de la récupération des détails du service.");
          if (err.response?.status === 404) navigate("/services");
        }
      };
      fetchService();
    }
  }, [id, token, navigate]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "tva" || name === "reduction"
          ? value === "" ? "" : parseFloat(value) || 0
          : newValue,
    }));

    if (name === "idFamille" && value) {
      try {
        const response = await axios.get(`http://localhost:5000/api/secteurservice/famille/${value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecteurServices(response.data);
        setFormData((prev) => ({ ...prev, idSecteur: "" }));
      } catch (err) {
        setError("Échec de la récupération des secteurs associés.");
        setSecteurServices([]);
      }
    } else if (name === "idFamille" && !value) {
      setSecteurServices([]);
      setFormData((prev) => ({ ...prev, idSecteur: "" }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length + formData.media.length > 5) {
      setError("Vous pouvez uploader un maximum de 5 fichiers.");
      return;
    }
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      setError("Seuls les fichiers image sont autorisés.");
      return;
    }
    setFormData({ ...formData, media: [...formData.media, ...validFiles] });
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
    if (files.length + formData.media.length > 5) {
      setError("Vous pouvez uploader un maximum de 5 fichiers.");
      return;
    }
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      setError("Seuls les fichiers image sont autorisés.");
      return;
    }
    setFormData({ ...formData, media: [...formData.media, ...validFiles] });
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    document.querySelector('input[name="media"]').click();
  };

  const removeFile = (index) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token) {
      setError("Aucun jeton trouvé. Veuillez vous connecter.");
      setLoading(false);
      return;
    }

    if (!formData.servicename || !formData.description || !formData.price || !formData.tva || !formData.idFamille || !formData.idSecteur) {
      setError("Le nom, la description, le prix, la TVA, la famille et le secteur sont requis.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("servicename", formData.servicename);
      data.append("description", formData.description);
      data.append("availability", formData.availability);
      data.append("price", formData.price.toString());
      data.append("tva", formData.tva.toString());
      data.append("promotionActive", formData.promotionActive.toString());
      data.append("reduction", formData.promotionActive && formData.reduction ? formData.reduction.toString() : "");
      data.append("state", formData.state);
      data.append("idFamille", formData.idFamille);
      data.append("idSecteur", formData.idSecteur);

      formData.media.forEach((file) => {
        if (file instanceof File) {
          data.append("media", file);
        }
      });

      let response;
      if (id && id !== "new") {
        response = await axios.put(`http://localhost:5000/api/services/${id}`, data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post("http://localhost:5000/api/services", data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "Échec de l'enregistrement du service.");
    } finally {
      setLoading(false);
    }
  };

  if (error && error.includes("Aucun jeton trouvé")) {
    return (
      <PageWrapper>
        <Container initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Error initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {error}
          </Error>
          <LoginButton
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Se connecter
          </LoginButton>
        </Container>
      </PageWrapper>
    );
  }

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
          {id && id !== "new" ? "Modifier Service" : "Ajouter Service"}
        </Title>
        {error && !error.includes("Aucun jeton trouvé") && (
          <Error initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {error}
          </Error>
        )}
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="servicename"
            value={formData.servicename}
            onChange={handleChange}
            placeholder="Nom du service"
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
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <option value="ouvert">Ouvert</option>
            <option value="fermé">Fermé</option>
          </Select>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Prix"
            required
            min="0"
            step="0.01"
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          />
          <Select
            name="tva"
            value={formData.tva}
            onChange={handleChange}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <option value="0">0%</option>
            <option value="7">7%</option>
            <option value="13">13%</option>
            <option value="19">19%</option>
          </Select>
          <CheckboxGroup>
            <label>Promotion Active</label>
            <Checkbox
              type="checkbox"
              name="promotionActive"
              checked={formData.promotionActive}
              onChange={handleChange}
            />
          </CheckboxGroup>
          {formData.promotionActive && (
            <Input
              type="number"
              name="reduction"
              value={formData.reduction}
              onChange={handleChange}
              placeholder="Réduction (%)"
              min="0"
              max="100"
              variants={formItemVariants}
              initial="hidden"
              animate="visible"
              custom={5}
            />
          )}
          <Select
            name="state"
            value={formData.state}
            onChange={handleChange}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={6}
          >
            <option value="à faire">À faire</option>
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </Select>
          <Select
            name="idFamille"
            value={formData.idFamille}
            onChange={handleChange}
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={7}
          >
            <option value="">Sélectionnez une famille</option>
            {familleServices.map((famille) => (
              <option key={famille._id} value={famille._id}>
                {famille.nom}
              </option>
            ))}
          </Select>
          <Select
            name="idSecteur"
            value={formData.idSecteur}
            onChange={handleChange}
            required
            disabled={!formData.idFamille || secteurServices.length === 0}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={8}
          >
            <option value="">Sélectionnez un secteur</option>
            {secteurServices.map((secteur) => (
              <option key={secteur._id} value={secteur._id}>
                {secteur.nomSecteur}
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
            custom={9}
          >
            <p>Glissez-déposez jusqu'à 5 images ici ou</p>
            <UploadButton type="button" onClick={handleUploadClick} whileTap={{ scale: 0.95 }}>
              Upload Directement
            </UploadButton>
            <input
              type="file"
              name="media"
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
          </DropZone>
          {formData.media.length > 0 && (
            <MediaPreview
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {formData.media.map((file, index) => (
                <MediaItem
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {typeof file === "string" ? (
                    <MediaImage
                      src={`http://localhost:5000${file}`}
                      alt={`Aperçu ${index}`}
                      onError={(e) => (e.target.src = "http://localhost:5000/uploads/default.jpg")}
                    />
                  ) : (
                    <MediaImage src={URL.createObjectURL(file)} alt={`Aperçu ${index}`} />
                  )}
                  <RemoveButton whileTap={{ scale: 0.95 }} onClick={() => removeFile(index)}>
                    Supprimer
                  </RemoveButton>
                </MediaItem>
              ))}
              {formData.media.length >= 5 && (
                <MaxFilesText
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Maximum de 5 fichiers atteint.
                </MaxFilesText>
              )}
            </MediaPreview>
          )}
          <SubmitButton
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {loading ? "Enregistrement..." : id && id !== "new" ? "Mettre à jour" : "Créer"}
          </SubmitButton>
        </Form>
      </Container>
    </PageWrapper>
  );
}

export default AddServiceForm;