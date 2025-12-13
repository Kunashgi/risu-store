import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { FaChevronDown } from 'react-icons/fa';
import './styles.css';

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="category-dropdown" ref={dropdownRef}>
      <button 
        className="category-dropdown-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Categorías
        <FaChevronDown className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <ul className="category-dropdown-menu">
          {categories.map(category => (
            <li key={category.id} className="category-dropdown-item">
              <Link 
                to={`/category/${category.id}`}
                className="category-dropdown-link"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;



