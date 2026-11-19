import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './ImageCarousel.css';

// Carrusel deslizable con el dedo (scroll-snap). En escritorio muestra flechas al pasar el mouse.
const ImageCarousel = ({ images, productId, alt, eager = false }) => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  const goTo = (i, e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = trackRef.current;
    const next = (i + images.length) % images.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      <div className="carousel-track" ref={trackRef} onScroll={onScroll}>
        {images.map((src, i) => (
          <Link to={`/product/${productId}`} className="carousel-slide" key={i} tabIndex={i === 0 ? 0 : -1}>
            <img
              src={src}
              alt={`${alt} - foto ${i + 1}`}
              loading={eager && i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable="false"
            />
          </Link>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button className="carousel-arrow prev" onClick={(e) => goTo(index - 1, e)} aria-label="Foto anterior">‹</button>
          <button className="carousel-arrow next" onClick={(e) => goTo(index + 1, e)} aria-label="Foto siguiente">›</button>
          <div className="carousel-dots" aria-hidden="true">
            {images.map((_, i) => (
              <span key={i} className={i === index ? 'active' : ''} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
