import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ variant = 'default' }) => {
  const { searchQuery, updateSearchQuery } = useSearch();

  const handleChange = (e) => {
    updateSearchQuery(e.target.value);
  };

  const handleClear = () => {
    updateSearchQuery('');
  };

  const variantClass = variant === 'navbar' ? 'navbar' : variant;
  
  return (
    <div className={`search-bar search-bar-${variantClass}`}>
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={handleChange}
          className="search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-button"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

