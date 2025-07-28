import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  
  // Verificación más robusta del ID
  const isValidId = !isNaN(productId) && productId > 0;
  
  // Redirección inmediata si el ID no es válido
  useEffect(() => {
    if (!isValidId) {
      navigate('/', { replace: true });
      return;
    }
    
    const productExists = products.some(p => p.id === productId);
    if (!productExists) {
      navigate('/', { replace: true });
    }
  }, [isValidId, productId, navigate]);

  const product = products.find(p => p.id === productId);
  
  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    swipe: true,
  };

  // Si no hay producto válido, no renderices nada (ya se redirigió)
  if (!product || !isValidId) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate(-1)} 
        className={styles.backButton}
      >
        &larr; Volver
      </button>
      
      <div className={styles.productHeader}>
        <h1 className={styles.productTitle}>{product.name}</h1>
      </div>
      
      <div className={styles.productContent}>
        <div className={styles.imageGallery}>
          <Slider {...sliderSettings}>
            {product.images.map((image, index) => (
              <div key={index} className={styles.slide}>
                <img 
                  src={image} 
                  alt={`${product.name} - Imagen ${index + 1}`} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'ruta-a-imagen-por-defecto.jpg';
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
        
        <div className={styles.productInfo}>
          <p className={styles.price}>{product.price} CLP</p>
          <p className={styles.description}>{product.description}</p>
          
          <button 
            className={styles.addToCartButton}
            onClick={() => navigate('/agendar-compra')}
          >
            Realizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;