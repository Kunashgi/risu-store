import React, { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { categories } from '../../data/categories';
import logo from '../../assets/images/page/logo-tienda.png';
import SearchBar from '../SearchBar/SearchBar';
import { whatsappLink } from '../../config';
import { useSearch } from '../../context/SearchContext';
import './styles.css';

const Navbar = () => {
  const { pathname } = useLocation();
  const { clearSearch } = useSearch();
  const chipsRef = useRef(null);

  // Centra la categoría activa en la fila de chips (útil en el celular)
  useEffect(() => {
    const row = chipsRef.current;
    const active = row && row.querySelector('.chip.active');
    if (active) {
      row.scrollTo({ left: active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [pathname]);

  const showSearch = !pathname.startsWith('/product') && pathname !== '/agendar-compra';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-top">
          <Link to="/" className="navbar-brand" onClick={clearSearch}>
            <img src={logo} alt="RisuStore" className="navbar-logo" />
            <span className="navbar-brand-text">
              RisuStore
              <small>Productos nuevos · San Bernardo</small>
            </span>
          </Link>
          <a
            className="navbar-wa"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>
        </div>

        {showSearch && <SearchBar />}

        <nav className="navbar-chips" aria-label="Categorías" ref={chipsRef}>
          <NavLink to="/" end className="chip" onClick={clearSearch}>
            ⭐ Destacados
          </NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/category/${c.id}`} className="chip" onClick={clearSearch}>
              {c.icon} {c.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
