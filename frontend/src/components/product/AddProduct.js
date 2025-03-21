import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  &:disabled {
    background: #edf2f7;
    color: #a0aec0;
    cursor: not-allowed;
  }

  &:hover:not(:disabled):not(:focus) {
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

const MaxFilesText = styled(motion.p)`
  color: #e53e3e;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.75rem;
  text-align: center;
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

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomProduit: "",
    descriptionProduit: "",
    prixUnitaire: 0,
    tva: 19,
    quantiteDisponible: 0,
    statutProduit: "Disponible",
    imageUrl: [],
    promotion: null,
    idFamille: "",
    idSecteur: "",
  });
  const [familleProduits, setFamilleProduits] = useState([]);
  const [secteurProduits, setSecteurProduits] = useState([]);
  const [filteredSecteurProduits, setFilteredSecteurProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      toast.error("Aucun token trouvé. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    const fetchFamilleProduits = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/familleproduit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFamilleProduits(response.data);
        if (response.data.length === 0) toast.warn("Aucune famille de produits trouvée.");
      } catch (err) {
        toast.error(
          err.response?.status === 401
            ? "Non autorisé. Veuillez vous reconnecter."
            : "Échec du chargement des familles de produits."
        );
      }
    };

    const fetchSecteurProduits = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/secteurproduits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSecteurProduits(response.data);
        setFilteredSecteurProduits(response.data);
      } catch (err) {
        toast.error(
          err.response?.status === 401
            ? "Non autorisé. Veuillez vous reconnecter."
            : "Échec du chargement des secteurs de produits."
        );
      }
    };

    fetchFamilleProduits();
    fetchSecteurProduits();

    if (id && id !== "new") {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const productData = response.data;
          setFormData({
            nomProduit: productData.nomProduit || "",
            descriptionProduit: productData.descriptionProduit || "",
            prixUnitaire: productData.prixUnitaire || 0,
            tva: productData.tva || 19,
            quantiteDisponible: productData.quantiteDisponible || 0,
            statutProduit: productData.statutProduit || "Disponible",
            imageUrl: productData.imageUrl || [],
            promotion: productData.promotion || null,
            idFamille: productData.idFamille?._id || productData.idFamille || "",
            idSecteur: productData.idSecteur?._id || productData.idSecteur || "",
          });

          if (productData.idFamille) {
            const secteurResponse = await axios.get(
              `http://localhost:5000/api/secteurproduits/famille/${productData.idFamille}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setFilteredSecteurProduits(secteurResponse.data);
          }
        } catch (err) {
          toast.error("Échec de la récupération des détails du produit.");
          if (err.response?.status === 404) navigate("/admin/myproducts");
        }
      };
      fetchProduct();
    }
  }, [id, token, navigate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "prixUnitaire" || name === "tva" || name === "quantiteDisponible"
          ? parseFloat(value) || 0
          : value,
    }));

    if (name === "idFamille" && value) {
      try {
        const response = await axios.get(`http://localhost:5000/api/secteurproduits/famille/${value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredSecteurProduits(response.data);
        setFormData((prev) => ({ ...prev, idSecteur: "" }));
      } catch (err) {
        toast.error("Échec de la récupération des secteurs liés.");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length + formData.imageUrl.length > 5) {
      toast.error("Vous pouvez uploader un maximum de 5 fichiers.");
      return;
    }
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Seuls les fichiers images sont autorisés.");
      return;
    }
    setFormData({ ...formData, imageUrl: [...formData.imageUrl, ...validFiles] });
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
    if (files.length + formData.imageUrl.length > 5) {
      toast.error("Vous pouvez uploader un maximum de 5 fichiers.");
      return;
    }
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Seuls les fichiers images sont autorisés.");
      return;
    }
    setFormData({ ...formData, imageUrl: [...formData.imageUrl, ...validFiles] });
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error("Aucun token trouvé. Veuillez vous connecter.");
      setLoading(false);
      return;
    }

    if (!formData.nomProduit || !formData.descriptionProduit || !formData.idFamille || !formData.idSecteur) {
      toast.error("Le nom, la description, la famille et le secteur du produit sont requis.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("nomProduit", formData.nomProduit);
      data.append("descriptionProduit", formData.descriptionProduit);
      data.append("prixUnitaire", formData.prixUnitaire.toString());
      data.append("tva", formData.tva.toString());
      data.append("quantiteDisponible", formData.quantiteDisponible.toString());
      data.append("statutProduit", formData.statutProduit);
      data.append("promotion", formData.promotion === null ? "" : formData.promotion || "");
      data.append("idFamille", formData.idFamille);
      data.append("idSecteur", formData.idSecteur);

      formData.imageUrl.forEach((file, index) => {
        if (file instanceof File) {
          data.append("imageUrl", file);
        } else if (typeof file === "string") {
          data.append(`existingImages[${index}]`, file);
        }
      });

      let response;
      if (id && id !== "new") {
        response = await axios.put(`http://localhost:5000/api/products/${id}`, data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Produit mis à jour avec succès !");
      } else {
        response = await axios.post("http://localhost:5000/api/products", data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Produit ajouté avec succès !");
      }

      navigate("/admin/myproducts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de la sauvegarde du produit.");
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
          {id && id !== "new" ? "Modifier Produit" : "Ajouter Produit"}
        </Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="nomProduit"
            value={formData.nomProduit}
            onChange={handleChange}
            placeholder="Nom du produit"
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          />
          <Textarea
            name="descriptionProduit"
            value={formData.descriptionProduit}
            onChange={handleChange}
            placeholder="Description"
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          />
          <Input
            type="number"
            name="prixUnitaire"
            value={formData.prixUnitaire}
            onChange={handleChange}
            placeholder="Prix unitaire"
            required
            min="0"
            step="0.01"
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          />
          <Select
            name="tva"
            value={formData.tva}
            onChange={handleChange}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <option value="0">0%</option>
            <option value="7">7%</option>
            <option value="13">13%</option>
            <option value="19">19%</option>
          </Select>
          <Input
            type="number"
            name="quantiteDisponible"
            value={formData.quantiteDisponible}
            onChange={handleChange}
            placeholder="Quantité disponible"
            required
            min="0"
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={4}
          />
          <Select
            name="statutProduit"
            value={formData.statutProduit}
            onChange={handleChange}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            <option value="Disponible">Disponible</option>
            <option value="Epuisé">Epuisé</option>
            <option value="Retiré">Retiré</option>
          </Select>
          <Select
            name="idFamille"
            value={formData.idFamille}
            onChange={handleChange}
            required
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={6}
          >
            <option value="">Sélectionnez une famille</option>
            {familleProduits.length > 0 ? (
              familleProduits.map((famille) => (
                <option key={famille._id} value={famille._id}>
                  {famille.nom}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Aucune famille disponible
              </option>
            )}
          </Select>
          <Select
            name="idSecteur"
            value={formData.idSecteur}
            onChange={handleChange}
            required
            disabled={!formData.idFamille}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={7}
          >
            <option value="">Sélectionnez un secteur</option>
            {filteredSecteurProduits.length > 0 ? (
              filteredSecteurProduits.map((secteur) => (
                <option key={secteur._id} value={secteur._id}>
                  {secteur.nomSecteur}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Aucun secteur disponible
              </option>
            )}
          </Select>
          <DropZone
            dragActive={dragActive}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            custom={8}
          >
            <p>Glissez-déposez jusqu'à 5 images ici ou</p>
            <UploadButton
              type="button"
              onClick={handleUploadClick}
              whileTap={{ scale: 0.95 }}
            >
              Upload Directement
            </UploadButton>
            <input
              type="file"
              name="imageUrl"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              ref={fileInputRef}
            />
          </DropZone>
          {formData.imageUrl.length > 0 && (
            <MediaPreview
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {formData.imageUrl.map((file, index) => (
                <MediaItem
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {typeof file === "string" ? (
                    <MediaImage
                      src={`http://localhost:5000${file}`}
                      alt={`Preview ${index}`}
                      onError={(e) => (e.target.src = "http://localhost:5000/uploads/default.jpg")}
                    />
                  ) : (
                    <MediaImage src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                  )}
                  <RemoveButton whileTap={{ scale: 0.95 }} onClick={() => removeFile(index)}>
                    Supprimer
                  </RemoveButton>
                </MediaItem>
              ))}
              {formData.imageUrl.length >= 5 && (
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
      <ToastContainer position="top-right" autoClose={3000} />
    </PageWrapper>
  );
}

export default ProductForm;