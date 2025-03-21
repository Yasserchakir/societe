import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaCity, FaLock, FaEdit, FaCheck } from 'react-icons/fa';
import axios from 'axios';

// Styles ajustés pour placer les icônes à l'extérieur
const ProfileContainer = styled.div`
  max-width: 800px;
  margin-top:50px;
margin-left:250px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: center;
  gap: 1rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  background: #fafafa;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const InputIcon = styled.span`
  font-size: 1rem;
  color: #6b7280;
  display: flex;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: ${props => (props.primary ? '#3b82f6' : '#e5e7eb')};
  color: ${props => (props.primary ? 'white' : '#1f2937')};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: ${props => (props.primary ? '#2563eb' : '#d1d5db')};
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: ${props => (props.success ? '#d1fae5' : '#fee2e2')};
  color: ${props => (props.success ? '#065f46' : '#991b1b')};
`;

const SecuritySection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
`;

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    prenom: '',
    email: '',
    telephone: '',
    city: '',
    avatar: '',
    role: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState({ text: '', success: false });

  // Récupérer le token JWT
  const getToken = () => localStorage.getItem('token');

  // Charger le profil au montage
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (error) {
        setMessage({ text: 'Erreur lors du chargement du profil', success: false });
      }
    };
    fetchProfile();
  }, []);

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Mise à jour du profil
  const handleSubmit = async () => {
    try {
      const token = getToken();
      const response = await axios.put('http://localhost:5000/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setEditMode(false);
      setMessage({ text: 'Profil mis à jour avec succès', success: true });
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.[0]?.msg || 'Erreur lors de la mise à jour';
      setMessage({ text: errorMsg, success: false });
    }
  };

  return (
    <ProfileContainer>
      <Header>
        <Title>Paramètres du profil</Title>
        <ActionButton primary onClick={editMode ? handleSubmit : () => setEditMode(true)}>
          {editMode ? <FaCheck /> : <FaEdit />}
          {editMode ? 'Sauvegarder' : 'Modifier'}
        </ActionButton>
      </Header>

      {message.text && (
        <Message success={message.success}>{message.text}</Message>
      )}

      <FormGrid>
        <FieldRow>
          <InputIcon><FaUser /></InputIcon>
          <InputField
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Nom"
          />
        </FieldRow>

        <FieldRow>
          <InputIcon><FaUser /></InputIcon>
          <InputField
            type="text"
            name="prenom"
            value={profile.prenom}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Prénom"
          />
        </FieldRow>

        <FieldRow>
          <InputIcon><FaEnvelope /></InputIcon>
          <InputField
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Email"
          />
        </FieldRow>

        <FieldRow>
          <InputIcon><FaPhone /></InputIcon>
          <InputField
            type="tel"
            name="telephone"
            value={profile.telephone}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Téléphone"
          />
        </FieldRow>

        <FieldRow>
          <InputIcon><FaCity /></InputIcon>
          <InputField
            type="text"
            name="city"
            value={profile.city}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Ville"
          />
        </FieldRow>

        <FieldRow>
          <InputIcon><FaLock /></InputIcon>
          <InputField
            type="password"
            name="password"
            disabled={!editMode}
            placeholder="Mot de passe"
          />
        </FieldRow>
      </FormGrid>

      <SecuritySection>
        <Title>Paramètres de sécurité</Title>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <ActionButton>Authentification à deux facteurs</ActionButton>
          <ActionButton style={{ background: '#ef4444', color: '#fff' }}>Supprimer le compte</ActionButton>
        </div>
      </SecuritySection>
    </ProfileContainer>
  );
};

export default AdminProfile;