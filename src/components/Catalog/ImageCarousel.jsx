import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageCarousel.css';

const ImageCarousel = ({ images, productId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const navigateToDetail = () => {
    navigate(`/product/${productId}`, {
      state: { 
        images,
        initialIndex: currentIndex 
      }
    });
  };

  const navigateImages = (direction) => {
    setCurrentIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? images.length - 1 : prev - 1;
      }
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div className="carousel-container">
      <div 
        className="carousel-image-container"
        onClick={navigateToDetail}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Vista del producto ${currentIndex + 1}`}
          className="carousel-image"
          loading="lazy"
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="carousel-button prev"
              onClick={(e) => {
                e.stopPropagation();
                navigateImages('prev');
              }}
              aria-label="Imagen anterior"
            >
              &lt;
            </button>
            <button 
              className="carousel-button next"
              onClick={(e) => {
                e.stopPropagation();
                navigateImages('next');
              }}
              aria-label="Siguiente imagen"
            >
              &gt;
            </button>
            
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;