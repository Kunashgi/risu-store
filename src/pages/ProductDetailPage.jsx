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
  const product = products.find(p => p.id === productId);

  // Redirigir al home si no hay producto
  useEffect(() => {
    if (!product) {
      navigate('/', { replace: true });
    }
  }, [product, navigate]);

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

  if (!product) {
    // Este return ya no es necesario porque el useEffect redirige
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
                />
              </div>
            ))}
          </Slider>
        </div>
        
        <div className={styles.productInfo}>
          <p className={styles.price}>{product.price} CLP </p>
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