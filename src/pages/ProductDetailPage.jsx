import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { FaWhatsapp, FaArrowLeft } from 'react-icons/fa';
import { products } from '../data/products';
import { whatsappLink, DELIVERY_OPTIONS } from '../config';
import CategorySection from '../components/Catalog/CategorySection';
import { Footer, Reviews, RatingBadge } from '../components/Catalog/Extras';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIndex(0);
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [id]);

  if (!product) return <Navigate to="/" replace />;

  const images = product.images || [product.image];
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const goTo = (i) => {
    const el = trackRef.current;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = trackRef.current;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  return (
    <div className={styles.page}>
      <button onClick={goBack} className={styles.back}>
        <FaArrowLeft /> Volver
      </button>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.track} ref={trackRef} onScroll={onScroll}>
            {images.map((src, i) => (
              <div className={styles.slide} key={i}>
                <img src={src} alt={`${product.name} - foto ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <span className={styles.counter}>{index + 1} / {images.length}</span>
          )}
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          {product.tag && (
            <span className={product.tag === 'ORIGINAL' ? styles.tagOriginal : styles.tagNew}>
              {product.tag === 'ORIGINAL' ? '✔ ORIGINAL' : product.tag}
            </span>
          )}
          <h1 className={styles.title}>{product.name}</h1>
          <RatingBadge />
          <p className={styles.price}>{product.price} <small>CLP</small></p>
          <p className={styles.description}>{product.description}</p>

          <a className={styles.waButton} href={whatsappLink(product)} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp /> Pedir por WhatsApp
          </a>

          <ul className={styles.delivery}>
            {DELIVERY_OPTIONS.map((o) => (
              <li key={o.title}>
                <span>{o.icon}</span>
                <div>
                  <strong>{o.title} · {o.text}</strong>
                  <small>{o.detail}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Reviews />
      {related.length > 0 && <CategorySection title="También te puede gustar" products={related} />}
      <Footer />

      {/* Barra fija inferior en el celular */}
      <div className={styles.stickyBar}>
        <div>
          <small>Precio</small>
          <strong>{product.price}</strong>
        </div>
        <a href={whatsappLink(product)} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp /> Pedir
        </a>
      </div>
    </div>
  );
};

export default ProductDetailPage;
