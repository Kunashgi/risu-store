import React from 'react';
import ImageCarousel from './ImageCarousel';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';


const ProductCard = ({ product }) => {

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/agendar-compra');
  };
  return (
    <div className="product-card">
      <div className="product-image-container">
        <ImageCarousel images={product.images || [product.image]} productId={product.id} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{product.price} CLP</span>
          <button className="add-to-cart" onClick={handleButtonClick}>Pedir <FaWhatsapp style={{ marginLeft: '8px' }} /> </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;