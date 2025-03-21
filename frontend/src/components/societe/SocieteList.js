import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SocieteList.css';

const SocieteList = () => {
  const [societes, setSocietes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocietes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour voir la liste des sociétés.');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching sociétés with token:', token);
        const response = await axios.get('http://localhost:5000/api/societes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);
        setSocietes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Erreur lors de la récupération des sociétés:', error);
        if (error.response) {
          console.log('Response Status:', error.response.status);
          console.log('Response Data:', error.response.data);
          if (error.response.status === 401) {
            alert('Session expirée ou token invalide. Veuillez vous reconnecter.');
            localStorage.removeItem('token');
            navigate('/login');
          } else if (error.response.status === 404) {
            alert('Route non trouvée. Vérifiez le backend sur http://localhost:5000/api/societes.');
          } else {
            alert(`Erreur: ${error.response.data.message || error.message}`);
          }
        } else {
          alert('Erreur réseau. Vérifiez que le backend est en marche.');
        }
      }
    };
    fetchSocietes();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté pour supprimer une société.');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/societes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSocietes(societes.filter((societe) => societe._id !== id));
      alert('Société supprimée avec succès!');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  return (
    <div className="societe-container">
      <h2 className="societe-title">Sociétés en Vue</h2>
      {societes.length === 0 ? (
        <p className="no-societe">Aucune société à afficher pour le moment.</p>
      ) : (
        <div className="table-wrapper">
          <table className="societe-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Secteur</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {societes.map((societe, index) => (
                <tr
                  key={societe._id}
                  className="societe-row"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <td>{societe.nomEntreprise || societe.nomVendeur || 'N/A'}</td>
                  <td>{societe.secteurActivite || 'N/A'}</td>
                  <td>{societe.email || 'N/A'}</td>
                  <td>{societe.numeroTelephone || 'N/A'}</td>
                  <td className="action-cell">
                    <Link to={`/societes/edit/${societe._id}`} className="action-btn edit-btn">
                      Modifier
                    </Link>
                    <button onClick={() => handleDelete(societe._id)} className="action-btn delete-btn">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/societes/create" className="create-btn">
        Ajouter une Société
      </Link>
    </div>
  );
};

export default SocieteList;