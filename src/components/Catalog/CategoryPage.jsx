import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import CategorySection from './CategorySection';
import { useNavigate } from 'react-router-dom';
import envio from '../../assets/images/page/envio-gratis3.png';
import envioMobile from '../../assets/images/page/mobile2.png';
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

      <div className="left-panel">
        <img
          src={envio}
          alt="Imagen descriptiva"
          className="panel-image"
        />

        <div className="delivery-message">
          <span className="delivery-icon">🚚</span>
          <span> Entregas coordinar por WhatsApp</span>
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