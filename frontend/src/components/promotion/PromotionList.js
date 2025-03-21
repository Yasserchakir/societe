import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle, FaTag, FaSave } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h1)`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  color: transparent;
  background: linear-gradient(to right, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  margin-bottom: 2rem;
  text-align: center;
`;

const AddButton = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(120deg, #34d399, #059669);
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 6px 15px rgba(52, 211, 153, 0.4);
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: linear-gradient(120deg, #059669, #047857);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(52, 211, 153, 0.5);
  }
`;

const TableWrapper = styled(motion.div)`
  width: 100%;
  overflow-x: auto; /* Active le défilement horizontal */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative; /* Pour le positionnement de la barre */
  -webkit-overflow-scrolling: touch; /* Améliore le défilement sur mobile */
`;

const Table = styled.table`
  width: 100%;
  min-width: 1200px; /* Définit une largeur minimale pour forcer le défilement */
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  padding: 1rem 1.5rem;
  background: linear-gradient(120deg, #667eea, #764ba2);
  color: white;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: #2d3748;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(237, 242, 247, 0.9);
  }
`;

const EditableInput = styled(motion.input)`
  padding: 0.4rem;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  background: #fff;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    outline: none;
  }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  ${({ active }) =>
    active
      ? `
        background: linear-gradient(120deg, #34d399, #059669);
        color: white;
      `
      : `
        background: linear-gradient(120deg, #a0aec0, #718096);
        color: white;
      `}
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const EditButton = styled(ActionButton)`
  background: linear-gradient(120deg, #fbbf24, #f59e0b);
  color: white;

  &:hover {
    background: linear-gradient(120deg, #f59e0b, #d97706);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
  }
`;

const SaveButton = styled(ActionButton)`
  background: linear-gradient(120deg, #34d399, #059669);
  color: white;

  &:hover {
    background: linear-gradient(120deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 211, 153, 0.4);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: linear-gradient(120deg, #f87171, #ef4444);
  color: white;

  &:hover {
    background: linear-gradient(120deg, #ef4444, #dc2626);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(248, 113, 113, 0.4);
  }
`;

const Loader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  color: #667eea;
  font-family: 'Roboto', sans-serif;
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: #ef4444;
  font-family: 'Roboto', sans-serif;
  background: rgba(254, 226, 226, 0.9);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
`;

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!token) {
        setError('You must be logged in to view promotions.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/promotions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPromotions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch promotions:', err);
        let errorMessage = 'Failed to load promotions. ';
        if (err.response) {
          errorMessage += err.response.data.message || 'Unauthorized or server error.';
          if (err.response.status === 401) {
            errorMessage += ' Please log in again.';
            localStorage.removeItem('token');
          }
        } else {
          errorMessage += 'Server is not responding. Please ensure the backend is running.';
        }
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchPromotions();
  }, [token]);

  const handleEdit = (promo) => {
    setEditingId(promo._id);
    setEditData({
      nomPromotion: promo.nomPromotion,
      description: promo.description || '',
      reduction: promo.reduction,
      dateDebut: new Date(promo.dateDebut).toISOString().slice(0, 10),
      dateFin: new Date(promo.dateFin).toISOString().slice(0, 10),
    });
  };

  const handleSave = async (id) => {
    if (!token) {
      setError('You must be logged in to edit promotions.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/promotions/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPromotions(promotions.map(promo => (promo._id === id ? response.data.promotion : promo)));
      setEditingId(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update promotion:', err);
      let errorMessage = 'Failed to update promotion. ';
      if (err.response) {
        errorMessage += err.response.data.message || 'Unauthorized or server error.';
        if (err.response.status === 401) {
          errorMessage += ' Please log in again.';
          localStorage.removeItem('token');
        }
      } else {
        errorMessage += 'Server is not responding.';
      }
      setError(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError('You must be logged in to delete promotions.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await axios.delete(`http://localhost:5000/api/promotions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPromotions(promotions.filter((promo) => promo._id !== id));
        setError(null);
      } catch (err) {
        console.error('Failed to delete promotion:', err);
        let errorMessage = 'Failed to delete promotion. ';
        if (err.response) {
          errorMessage += err.response.data.message || 'Unauthorized or server error.';
          if (err.response.status === 401) {
            errorMessage += ' Please log in again.';
            localStorage.removeItem('token');
          }
        } else {
          errorMessage += 'Server is not responding.';
        }
        setError(errorMessage);
      }
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <Container>
        <Loader initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <FaSpinner className="spin" /> Loading...
        </Loader>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <FaExclamationTriangle /> {error}
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        Promotions Dashboard
      </Title>
      <AddButton to="/admin/promotion/new" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <FaPlus /> Create New Promotion
      </AddButton>
      <TableWrapper initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Discount</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Products</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo, index) => {
              const isActive = new Date(promo.dateFin) >= new Date();
              const isEditing = editingId === promo._id;

              return (
                <motion.tr
                  key={promo._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Td>
                    {isEditing ? (
                      <EditableInput
                        name="nomPromotion"
                        value={editData.nomPromotion}
                        onChange={handleChange}
                      />
                    ) : (
                      promo.nomPromotion
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <EditableInput
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                      />
                    ) : (
                      promo.description || 'N/A'
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <EditableInput
                        type="number"
                        name="reduction"
                        value={editData.reduction}
                        onChange={handleChange}
                        min="1"
                        max="100"
                      />
                    ) : (
                      `${promo.reduction}%`
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <EditableInput
                        type="date"
                        name="dateDebut"
                        value={editData.dateDebut}
                        onChange={handleChange}
                      />
                    ) : (
                      new Date(promo.dateDebut).toLocaleDateString()
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <EditableInput
                        type="date"
                        name="dateFin"
                        value={editData.dateFin}
                        onChange={handleChange}
                      />
                    ) : (
                      new Date(promo.dateFin).toLocaleDateString()
                    )}
                  </Td>
                  <Td>{promo.product.map((p) => p.nomProduit).join(', ') || 'N/A'}</Td>
                  <Td>
                    <Status active={isActive}>
                      <FaTag /> {isActive ? 'Active' : 'Inactive'}
                    </Status>
                  </Td>
                  <Td>
                    {isEditing ? (
                      <SaveButton
                        onClick={() => handleSave(promo._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaSave /> Save
                      </SaveButton>
                    ) : (
                      <EditButton
                        onClick={() => handleEdit(promo)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEdit /> Edit
                      </EditButton>
                    )}
                    <DeleteButton
                      onClick={() => handleDelete(promo._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash /> Delete
                    </DeleteButton>
                  </Td>
                </motion.tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default PromotionList;