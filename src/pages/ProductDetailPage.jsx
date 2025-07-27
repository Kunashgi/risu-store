import React from 'react';
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

    const getCategoryName = (categoryId) => {
    const categories = {
      1: 'Tecnología',
      2: 'Deportes',
      3: 'Otros',
      4: 'Moda',
      5: 'Juguetes',
      // Puedes agregar más categorías según necesites
    };
    return categories[categoryId] || `Categoría ${categoryId}`;
  };
  // Configuración del carrusel
  const sliderSettings = {
    dots: true,           // sin puntitos abajo
    arrows: true,          // mostrar flechas
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,      // desactiva arrastre con el mouse
    swipe: true,          // desactiva swipe en touch
  };

  if (!product) {
    return (
      <div className={styles.container}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/')}>Volver al catálogo</button>
      </div>
    );
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
          
          {/* Puedes agregar más información aquí */}
          
          <button className={styles.addToCartButton}
          onClick={() => navigate('/agendar-compra')}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;