import React from 'react';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import CategorySection from './CategorySection';
import { useNavigate } from 'react-router-dom';
import envio from '../../assets/images/page/envio-gratis3.png';
import envioMobile from '../../assets/images/page/mobile2.png';
import { FaWhatsapp } from 'react-icons/fa';
import './styles.css';

const CatalogPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/agendar-compra');
  };

  return (
    <div className="catalog-container">
      {/* Contenido principal del catáenvio */}
      <div className="catalog-page">
        {categories.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            products={products}
          />
        ))}
      </div>

      {/* Panel móvil (solo visible en mobile) */}
      <div className="mobile-panel">
        <img
          src={envioMobile}
          alt="Envíos a domicilio"
          className="mobile-image"
        />

        <div className="mobile-button-container">
          <button
            className="mobile-button"
            onClick={handleButtonClick}
          >
            Agendar Compra <FaWhatsapp style={{ marginLeft: '8px' }} />
          </button>

          <div className="mobile-delivery-message">
            <span className="delivery-icon">🚚</span>
            <span>Entregas coordinar por WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Panel izquierdo (solo visible en desktop) */}
      <div className="left-panel">
        <img
          src={envio}
          alt="Imagen descriptiva"
          className="panel-image"
        />

        <div className="delivery-message">
          <span className="delivery-icon">🚚</span>
          <span>Entregas coordinar por WhatsApp</span>
        </div>

        <button
          className="panel-button"
          onClick={handleButtonClick}
        >
          Agendar Compra <FaWhatsapp style={{ marginLeft: '8px' }} />
        </button>
      </div>
    </div>
  );
};

export default CatalogPage;