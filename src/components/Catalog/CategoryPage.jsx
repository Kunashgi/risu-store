import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import CategorySection from './CategorySection';
import { useNavigate } from 'react-router-dom';
import blueExpressLogo from '../../assets/images/page/blue-express-logo.png';
import { FaWhatsapp } from 'react-icons/fa';
import './styles.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
    const navigate = useNavigate();

  // Encontrar la categoría específica
  const currentCategory = categories.find(
    category => category.id === parseInt(categoryId)
  );

  // Si no existe la categoría, mostrar mensaje
  if (!currentCategory) {
    return <div className="catalog-page">Categoría no encontrada</div>;
  }

  const handleButtonClick = () => {
    navigate('/agendar-compra');
  };


  return (
    <div className="catalog-container">
      <div className="catalog-page">
        {/* Mostrar solo la sección de la categoría actual */}
        <CategorySection
          key={currentCategory.id}
          category={currentCategory}
          products={products}
          showTitle={true} // Opcional: para asegurar que el título se muestre
        />
      </div>

      <div className="mobile-panel" onClick={handleButtonClick}>
        <span className="mobile-delivery-text-simple">
          Envíos a domicilio disponibles a $3.500 con Blue Express
        </span>
        <div className="mobile-whatsapp-icon-simple">
          <FaWhatsapp />
        </div>
      </div>

      <div className="left-panel">
        <div className="delivery-info-card">
          <div className="delivery-info-content">
            <div className="delivery-info-text">
              <p className="delivery-main-text">
                Envíos a domicilio disponibles a $3.500 con Blue Express dentro de la Región Metropolitana
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

export default CategoryPage;