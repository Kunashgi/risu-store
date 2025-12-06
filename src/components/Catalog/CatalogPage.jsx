import React from 'react';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import CategorySection from './CategorySection';
import { useNavigate } from 'react-router-dom';
import blueExpressLogo from '../../assets/images/page/blue-express-logo.png';
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
        {/* <img
          src={envioMobile}
          alt="Envíos a domicilio"
          className="mobile-image"
        /> */}

        <div className="mobile-button-container">
          <button
            className="mobile-button"
            onClick={handleButtonClick}
          >
            <FaWhatsapp  />
          </button>

          <div className="mobile-delivery-message">
            <span className="delivery-icon">🚚</span>
            <span>Entregas a Domicilio: $3.100 (BlueExpress) <br /> coordinar por WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Panel izquierdo (solo visible en desktop) */}
      <div className="left-panel">
        <div className="delivery-info-card">
          <div className="delivery-info-content">
            <div className="delivery-info-text">
              <p className="delivery-main-text">
                Envíos a domicilio disponibles a $3.100 con Blue Express dentro de la Región Metropolitana
              </p>
              <p className="delivery-sub-text">
                Coordinar por WhatsApp
              </p>
            </div>
            <div className="delivery-logos">
              <div className="delivery-logo-item">
                <img 
                  src={blueExpressLogo} 
                  alt="Logo Blue Express" 
                  className="blue-express-logo-small"
                />
              </div>
              <div className="delivery-logo-item whatsapp-logo">
                <FaWhatsapp className="whatsapp-icon-logo" />
              </div>
            </div>
          </div>
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