import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Modules Swiper
import 'swiper/css'; // Style de base de Swiper
import 'swiper/css/navigation'; // Style pour les flèches de navigation
import 'swiper/css/pagination'; // Style pour la pagination
import './BookingServiceCards.css';

const ServiceCards = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [reservationData, setReservationData] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour voir les services');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Erreur lors du chargement des services');
    }
  };

  const handleReserveClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté');
        return;
      }

      const payload = {
        serviceId: selectedService._id,
        timeSlot: {
          date: reservationData.date,
          startTime: reservationData.startTime,
          endTime: reservationData.endTime,
        },
      };

      const response = await axios.post('http://localhost:5000/api/reservations', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Réservation effectuée avec succès');
      setShowModal(false);
      setReservationData({ date: '', startTime: '', endTime: '' });
      fetchServices(); // Refresh services to reflect booked slots
    } catch (error) {
      console.error('Error creating reservation:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  return (
    <div className="service-cards-container">
      <h2>Nos Services</h2>
      <div className="swiper-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="service-swiper"
        >
          {services.length === 0 ? (
            <SwiperSlide>
              <p>Aucun service disponible</p>
            </SwiperSlide>
          ) : (
            services.map((service) => (
              <SwiperSlide key={service._id}>
                <div className="service-card">
                  {service.media && service.media.length > 0 ? (
                    <img
                      src={`http://localhost:5000${service.media[0]}`}
                      alt={service.servicename}
                      className="service-card-image"
                      onError={(e) => (e.target.src = 'http://localhost:5000/uploads/default.jpg')}
                    />
                  ) : (
                    <div className="no-image">Aucune image</div>
                  )}
                  <div className="service-card-content">
                    <h3>{service.servicename}</h3>
                    <p>{service.description.slice(0, 100)}...</p>
                    <p className="price">{service.finalPrice.toFixed(2)} €</p>
                    <button
                      className="reserve-btn"
                      onClick={() => handleReserveClick(service)}
                      disabled={service.availability === 'fermé'}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>

      {/* Reservation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Réserver: {selectedService?.servicename}</h3>
            <form onSubmit={handleReserveSubmit}>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={reservationData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Heure de début:</label>
                <input
                  type="time"
                  name="startTime"
                  value={reservationData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Heure de fin:</label>
                <input
                  type="time"
                  name="endTime"
                  value={reservationData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Confirmer</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ServiceCards;