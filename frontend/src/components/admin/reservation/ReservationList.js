import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styles précédents inchangés (PageWrapper, Container, etc.)
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  display: flex;
  justify-content: center;
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
  max-width: 1200px;
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

const FilterSection = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  color: #2d3748;
  font-size: 1.1rem;
`;

const Input = styled(motion.input)`
  padding: 0.75rem 1.25rem;
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
`;

const Select = styled(motion.select)`
  padding: 0.75rem 1.25rem;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1rem;
`;

const Th = styled.th`
  padding: 1rem 1.5rem;
  background: linear-gradient(120deg, #edf2f7, #e2e8f0);
  color: #4a5568;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  text-align: left;
`;

const Td = styled(motion.td)`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  border-bottom: 1px solid #edf2f7;
  transition: background 0.3s ease;
`;

const Row = styled(motion.tr)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    ${Td} {
      background: rgba(245, 250, 255, 0.95);
    }
  }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
  color: white;
  transition: transform 0.3s ease;

  &.status-pending {
    background: linear-gradient(120deg, #ffc107, #e0a800);
  }

  &.status-confirmed {
    background: linear-gradient(120deg, #28a745, #218838);
  }

  &.status-canceled {
    background: linear-gradient(120deg, #dc3545, #c82333);
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const EditButton = styled(motion.button)`
  padding: 0.5rem;
  background: linear-gradient(120deg, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(120deg, #357abd, #2a6399);
    transform: scale(1.15);
    box-shadow: 0 6px 20px rgba(74, 144, 226, 0.5);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  padding: 2.5rem;
  border-radius: 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  position: relative;
  text-align: left;
`;

const ModalTitle = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-weight: 700;
  font-size: 2rem;
  color: transparent;
  background: linear-gradient(120deg, #2d3748, #4a90e2);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 2px 15px rgba(45, 55, 72, 0.3);
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #4a90e2, transparent);
    animation: underline 2s infinite ease-in-out;
  }

  @keyframes underline {
    0% { width: 0; }
    50% { width: 80px; }
    100% { width: 0; }
  }
`;

const ModalForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FormLabel = styled.label`
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  color: #4a5568;
  text-transform: uppercase;
  width: 150px;
`;

const FormInput = styled(motion.input)`
  width: 100%;
  padding: 1rem 1.25rem;
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
`;

const ModalSelect = styled(motion.select)`
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 15px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
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
`;

const ModalButtons = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ModalButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 15px;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.update {
    background: linear-gradient(120deg, #68d391, #38a169);
    color: white;
    box-shadow: 0 4px 15px rgba(104, 211, 145, 0.4);
  }

  &.cancel {
    background: linear-gradient(120deg, #f56565, #c53030);
    color: white;
    box-shadow: 0 4px 15px rgba(245, 101, 101, 0.4);
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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

  &:hover::before {
    width: 300px;
    height: 300px;
  }
`;

const NoData = styled(motion.p)`
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  font-style: italic;
`;

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    clientName: "",
    serviceName: "",
    status: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    axios
      .get("http://localhost:5000/api/reservations")
      .then((response) => {
        setReservations(response.data);
        setFilteredReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des réservations :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (reservation) =>
          new Date(reservation.timeSlot.date).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((reservation) => reservation.status === selectedStatus);
    }

    setFilteredReservations(filtered);
  }, [searchTerm, selectedDate, selectedStatus, reservations]);

  const openEditModal = (reservation) => {
    setFormData({
      id: reservation._id,
      clientName: reservation.user
        ? `${reservation.user.name} ${reservation.user.prenom}`
        : "N/A",
      serviceName: reservation.service ? reservation.service.servicename : "N/A",
      status: reservation.status,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setFormData({
      id: "",
      clientName: "",
      serviceName: "",
      status: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id) return;

    // Préparer les données à envoyer au serveur
    const updatedData = {
      status: formData.status,
      // Note : Les champs clientName et serviceName nécessitent une logique supplémentaire
      // pour mettre à jour les objets user et service dans la base de données.
      // Cela dépend de la structure de votre API et de votre backend.
      // Pour simplifier, je vais supposer que ces champs sont directement modifiables.
      user: {
        name: formData.clientName.split(" ")[0] || "",
        prenom: formData.clientName.split(" ")[1] || "",
      },
      service: {
        servicename: formData.serviceName,
      },
    };

    axios
      .put(`http://localhost:5000/api/reservations/${formData.id}`, updatedData)
      .then(() => {
        fetchReservations();
        closeEditModal();
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de la réservation :", error);
      });
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
          Réservations Récentes
        </Title>
        <FilterSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FilterItem>
            <Input
              type="text"
              placeholder="Rechercher par client ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel htmlFor="date">Date :</FilterLabel>
            <Input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </FilterItem>
          <FilterItem>
            <FilterLabel htmlFor="status">Statut :</FilterLabel>
            <Select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="canceled">Annulé</option>
            </Select>
          </FilterItem>
        </FilterSection>
        {loading ? (
          <NoData
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Chargement des réservations...
          </NoData>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID Réservation</Th>
                <Th>Client</Th>
                <Th>Service</Th>
                <Th>Date</Th>
                <Th>Heure</Th>
                <Th>Statut</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation, index) => (
                  <Row
                    key={reservation._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <Td>#{reservation._id.slice(-6)}</Td>
                    <Td>
                      {reservation.user
                        ? `${reservation.user.name} ${reservation.user.prenom}`
                        : "N/A"}
                    </Td>
                    <Td>
                      {reservation.service ? reservation.service.servicename : "N/A"}
                    </Td>
                    <Td>{new Date(reservation.timeSlot.date).toLocaleDateString()}</Td>
                    <Td>
                      {reservation.timeSlot.startTime} - {reservation.timeSlot.endTime}
                    </Td>
                    <Td>
                      <Status className={`status-${reservation.status.toLowerCase()}`}>
                        {reservation.status === "pending"
                          ? "En attente"
                          : reservation.status === "confirmed"
                          ? "Confirmé"
                          : "Annulé"}
                      </Status>
                    </Td>
                    <Td>
                      <EditButton
                        whileHover={{ rotate: 360 }}
                        onClick={() => openEditModal(reservation)}
                        title="Modifier la réservation"
                      >
                        <FaEdit />
                      </EditButton>
                    </Td>
                  </Row>
                ))
              ) : (
                <Row>
                  <Td colSpan="7">
                    <NoData
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Aucune réservation trouvée.
                    </NoData>
                  </Td>
                </Row>
              )}
            </tbody>
          </Table>
        )}
        {editModalOpen && formData.id && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ModalTitle>Modifier la Réservation</ModalTitle>
              <ModalForm
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FormItem>
                  <FormLabel htmlFor="id">ID Réservation :</FormLabel>
                  <FormInput
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    disabled // L'ID est généralement non modifiable
                  />
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor="clientName">Client :</FormLabel>
                  <FormInput
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                  />
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor="serviceName">Service :</FormLabel>
                  <FormInput
                    id="serviceName"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                  />
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor="status">Nouveau Statut :</FormLabel>
                  <ModalSelect
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="canceled">Annulé</option>
                  </ModalSelect>
                </FormItem>
                <ModalButtons
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <ModalButton
                    type="submit"
                    className="update"
                    whileTap={{ scale: 0.95 }}
                  >
                    Mettre à jour
                  </ModalButton>
                  <ModalButton
                    type="button"
                    className="cancel"
                    whileTap={{ scale: 0.95 }}
                    onClick={closeEditModal}
                  >
                    Annuler
                  </ModalButton>
                </ModalButtons>
              </ModalForm>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container>
    </PageWrapper>
  );
};

export default ReservationList;