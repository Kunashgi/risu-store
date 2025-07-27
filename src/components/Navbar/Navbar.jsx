import React, { useState, useEffect } from 'react';
import NavItem from './NavItem';
import { categories } from '../../data/categories';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/page/logo-tienda.png';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Botón del menú hamburguesa para móviles */}
      <button 
        className="menu-toggle" 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="menu-icon">{isOpen ? '✕' : ' Categorias ☰'}</span>
      </button>

      {/* Imagen del logo (aparece en desktop) */}
    <div 
      onClick={() => navigate('/')} // Redirige a la página de inicio
      style={{ cursor: 'pointer' }} // Cambia el cursor a pointer para indicar que es clickeable
    >
      <img 
        src={logo} 
        alt="Logo" 
        className="navbar-logo" 
        style={{ maxWidth: '150px', height: 'auto' }} // Estilos opcionales para el logo
      />
    </div>

      {/* Lista de navegación */}
      <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
        <li className="nav-item">
          <Link 
            to="/" 
            className="nav-link" 
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>
        </li>
        {categories.map(category => (
          <NavItem 
            key={category.id} 
            category={category} 
            onClick={() => setIsOpen(false)} 
          />
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;