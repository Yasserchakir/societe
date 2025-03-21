// src/components/FilterSection.js
import React from 'react';
import { FaFilter, FaSearch, FaLaptopCode, FaUsers, FaDesktop } from 'react-icons/fa';
import './FilterSection.css'; // Style spécifique pour cette composante

const FilterSection = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="filter-section">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher un service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="category-filters">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <FaFilter /> Tous
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'Développement Web' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Développement Web')}
        >
          <FaLaptopCode /> Développement Web
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'Famille Informatique' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Famille Informatique')}
        >
          <FaDesktop /> Informatique Famille
        </button>
        <button
          className={`filter-btn ${selectedCategory === 'Famille Digital' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Famille Digital')}
        >
          <FaUsers /> Digital Famille
        </button>
      </div>
    </div>
  );
};

export default FilterSection;