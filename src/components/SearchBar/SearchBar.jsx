import React from 'react';
import { useSearch } from '../../context/SearchContext';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
  const { searchQuery, updateSearchQuery } = useSearch();

  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="search"
        placeholder="Buscar: vaso, cargador, pelota..."
        value={searchQuery}
        onChange={(e) => updateSearchQuery(e.target.value)}
        className="search-input"
        aria-label="Buscar productos"
        enterKeyHint="search"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => updateSearchQuery('')}
          className="search-clear"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
