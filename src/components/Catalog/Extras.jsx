import React from 'react';
import { FaWhatsapp, FaStar, FaFacebook } from 'react-icons/fa';
import { DELIVERY_OPTIONS, whatsappLink } from '../../config';
import { marketplaceRating as rating, reviews } from '../../data/reviews';
import './styles.css';

const Stars = ({ n = 5 }) => (
  <span className="stars" aria-label={`${n} de 5 estrellas`}>
    {Array.from({ length: 5 }, (_, i) => <FaStar key={i} className={i < n ? 'on' : ''} />)}
  </span>
);

// Insignia corta de calificación (para el hero y la ficha de producto)
export const RatingBadge = ({ light }) => (
  <a
    href="#opiniones"
    className={`rating-badge ${light ? 'light' : ''}`}
    onClick={(e) => {
      const el = document.getElementById('opiniones');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }}
  >
    <FaStar className="rating-star" /> <b>{rating.average.toString().replace('.', ',')}</b>
    <span>· {rating.count} calificaciones en Marketplace</span>
  </a>
);

// Sección de opiniones reales de Facebook Marketplace
export const Reviews = () => {
  const max = Math.max(...rating.strengths.map((s) => s.count));
  return (
    <section className="reviews" id="opiniones">
      <div className="section-head">
        <div>
          <h2>💬 Lo que dicen los compradores</h2>
          <p>Calificaciones reales de mi perfil de vendedor en Facebook Marketplace</p>
        </div>
      </div>

      <div className="reviews-summary">
        <div className="reviews-score">
          <strong>{rating.average.toString().replace('.', ',')}</strong>
          <Stars n={5} />
          <small>{rating.count} calificaciones</small>
        </div>
        <div className="reviews-strengths">
          <span className="reviews-badge">🏅 {rating.badge}</span>
          {rating.strengths.map((s) => (
            <div className="strength" key={s.label}>
              <span>{s.label}</span>
              <div className="strength-bar"><i style={{ width: `${(s.count / max) * 100}%` }} /></div>
              <b>{s.count}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((r) => (
          <a
            className="review-card"
            key={r.name + r.date}
            href={rating.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Opinión de ${r.name}, ver en Facebook`}
          >
            <div className="review-head">
              <span className="review-avatar">{r.name[0]}</span>
              <div>
                <strong>{r.name}</strong>
                <small>{r.date}</small>
              </div>
            </div>
            <Stars n={r.stars} />
            <div className="review-tags">
              {r.highlights.map((h) => <span key={h}>✓ {h}</span>)}
            </div>
          </a>
        ))}

        {/* Tarjeta final del carrusel: lleva a Facebook */}
        <a className="review-card review-more" href={rating.profileUrl} target="_blank" rel="noopener noreferrer">
          <FaFacebook className="review-more-icon" />
          <strong>Ver más opiniones</strong>
          <small>Las {rating.count} calificaciones en Facebook Marketplace</small>
          <span className="review-more-btn">Ver más ›</span>
        </a>
      </div>
    </section>
  );
};

// Franja de beneficios de entrega (se desliza horizontalmente en el celular)
export const DeliveryStrip = () => (
  <div className="delivery-strip">
    {DELIVERY_OPTIONS.map((o) => (
      <div className="delivery-pill" key={o.title}>
        <span className="delivery-icon">{o.icon}</span>
        <span>
          <strong>{o.text}</strong>
          <small>{o.title}</small>
        </span>
      </div>
    ))}
  </div>
);

// Bloque de cómo comprar, al final de la página
export const HowToBuy = () => (
  <section className="how-to-buy">
    <h2>¿Cómo comprar?</h2>
    <ol className="steps">
      <li><span>1</span>Elige tu producto y toca <b>Pedir</b>.</li>
      <li><span>2</span>Se abre WhatsApp con el producto ya escrito.</li>
      <li><span>3</span>Coordinamos entrega o envío y el pago.</li>
    </ol>
    <div className="delivery-list">
      {DELIVERY_OPTIONS.map((o) => (
        <div className="delivery-row" key={o.title}>
          <span className="delivery-icon">{o.icon}</span>
          <div>
            <strong>{o.title} · {o.text}</strong>
            <small>{o.detail}</small>
          </div>
        </div>
      ))}
    </div>
    <a className="btn-wa btn-lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
      <FaWhatsapp /> Escríbenos por WhatsApp
    </a>
  </section>
);

// Botón flotante de WhatsApp
export const FloatingWhatsApp = ({ product }) => (
  <a
    className="floating-wa"
    href={whatsappLink(product)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Escríbenos por WhatsApp"
  >
    <FaWhatsapp />
  </a>
);

export const Footer = () => (
  <footer className="site-footer">
    <strong>RisuStore</strong>
    <span>Productos nuevos · San Bernardo, Región Metropolitana</span>
    <span>Pedidos y consultas solo por WhatsApp</span>
  </footer>
);
