import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaSave } from 'react-icons/fa';

const Container = styled.div`
  padding: 40px;
  max-width: 700px;
  margin-left:270px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled(motion.h1)`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: transparent;
  background: linear-gradient(to right, #2d3748, #63b3ed);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(45, 55, 72, 0.2);
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Label = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  color: #34495e;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled(motion.input)`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 5px rgba(52, 152, 219, 0.2);
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }
`;

const Textarea = styled(motion.textarea)`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);
  min-height: 120px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 5px rgba(52, 152, 219, 0.2);
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
    font-style: italic;
  }
`;

const Select = styled(motion.select)`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 5px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
`;

const DateInput = styled(Input)`
  padding-right: 2.5rem;
`;

const CalendarIcon = styled(FaCalendarAlt)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #3498db;
  font-size: 1.2rem;
  pointer-events: none;
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  background: linear-gradient(120deg, #68d391, #38a169);
  color: white;
  border: none;
  border-radius: 15px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 6px 20px rgba(104, 211, 145, 0.3);
  transition: all 0.3s ease;
  align-self: center;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: linear-gradient(120deg, #38a169, #2f855a);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(104, 211, 145, 0.4);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Loader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  color: #2d3748;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 2rem;
`;

const GlobalStyle = `
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  color: #e53e3e;
  font-family: 'Roboto', sans-serif;
  background: rgba(255, 245, 245, 0.9);
  padding: 1rem 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(229, 62, 62, 0.2);
  margin-bottom: 2rem;
`;

const PromotionForm = () => {
  const [formData, setFormData] = useState({
    nomPromotion: '',
    description: '',
    reduction: '',
    dateDebut: '',
    dateFin: '',
    productIds: [],
    error: null,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setFormData(prev => ({ ...prev, error: 'You must be logged in as a Vendeur to access this page.' }));
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await fetchProducts();
      if (promotionId) {
        await fetchPromotion();
      }
      setLoading(false);
    };
    fetchData();
  }, [promotionId, token]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setFormData(prev => ({ ...prev, error: null }));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      let errorMessage = 'Failed to load your products. ';
      if (err.response) {
        errorMessage += err.response.data.message || 'Server error.';
      } else {
        errorMessage += 'Please check your connection or login status.';
      }
      setFormData(prev => ({ ...prev, error: errorMessage }));
    }
  };

  const fetchPromotion = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/promotions/${promotionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const promo = response.data;
      setFormData({
        nomPromotion: promo.nomPromotion,
        description: promo.description,
        reduction: promo.reduction,
        dateDebut: promo.dateDebut.slice(0, 10),
        dateFin: promo.dateFin.slice(0, 10),
        productIds: promo.product.map(p => p._id),
        error: null,
      });
    } catch (err) {
      console.error('Failed to fetch promotion:', err);
      setFormData(prev => ({
        ...prev,
        error: 'Failed to load promotion. Ensure you have permission to edit this promotion.',
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, error: null });
  };

  const handleProductChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, productIds: selected, error: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setFormData(prev => ({ ...prev, error: 'You must be logged in as a Vendeur to submit this form.' }));
      return;
    }

    setLoading(true);
    try {
      const dataToSubmit = { ...formData, product: formData.productIds };
      delete dataToSubmit.error;

      if (promotionId) {
        await axios.put(`http://localhost:5000/api/promotions/${promotionId}`, dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const response = await axios.post('http://localhost:5000/api/promotions', dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newPromo = response.data.promotion;
        await Promise.all(formData.productIds.map(productId =>
          axios.put(`http://localhost:5000/api/products/${productId}`, { promotion: newPromo._id }, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ));
      }
      navigate('/admin/promotion');
    } catch (err) {
      console.error('Failed to save promotion:', err);
      let errorMessage = 'Failed to save promotion. ';
      if (err.response) {
        errorMessage += err.response.data.message || 'Server error.';
      } else {
        errorMessage += 'Please try again.';
      }
      setFormData(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {promotionId ? 'Edit Promotion' : 'Create Promotion'}
      </Title>
      {loading && (
        <Loader
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSpinner className="spin" /> Loading...
        </Loader>
      )}
      {formData.error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaExclamationTriangle /> {formData.error}
        </ErrorMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Promotion Name</Label>
          <Input
            type="text"
            name="nomPromotion"
            value={formData.nomPromotion}
            onChange={handleChange}
            required
            disabled={loading || !token}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading || !token}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Discount (%)</Label>
          <Input
            type="number"
            name="reduction"
            value={formData.reduction}
            onChange={handleChange}
            min="1"
            max="100"
            required
            disabled={loading || !token}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Start Date</Label>
          <DateInputWrapper>
            <DateInput
              type="date"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              required
              disabled={loading || !token}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <CalendarIcon />
          </DateInputWrapper>
        </FormGroup>
        <FormGroup>
          <Label>End Date</Label>
          <DateInputWrapper>
            <DateInput
              type="date"
              name="dateFin"
              value={formData.dateFin}
              onChange={handleChange}
              required
              disabled={loading || !token}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            <CalendarIcon />
          </DateInputWrapper>
        </FormGroup>
        <FormGroup>
          <Label>Select Your Products (Hold Ctrl/Cmd to select multiple)</Label>
          <Select
            multiple
            name="productIds"
            value={formData.productIds}
            onChange={handleProductChange}
            required
            disabled={loading || !token}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {products.length === 0 ? (
              <option value="">No products available</option>
            ) : (
              products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.nomProduit}
                </option>
              ))
            )}
          </Select>
        </FormGroup>
        <SubmitButton
          type="submit"
          disabled={loading || !token}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <FaSave /> {promotionId ? 'Update Promotion' : 'Create Promotion'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default PromotionForm;

 