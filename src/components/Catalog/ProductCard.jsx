import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel';
import { whatsappLink } from '../../config';
import './styles.css';

const ProductCard = ({ product, eager }) => (
  <article className="product-card">
    <div className="product-media">
      <ImageCarousel
        images={product.images || [product.image]}
        productId={product.id}
        alt={product.name}
        eager={eager}
      />
      {product.tag && (
        <span className={`product-tag ${product.tag === 'ORIGINAL' ? 'tag-original' : 'tag-new'}`}>
          {product.tag === 'ORIGINAL' ? '✔ ORIGINAL' : product.tag}
        </span>
      )}
    </div>
    <div className="product-body">
      <Link to={`/product/${product.id}`} className="product-title">
        {product.name}
      </Link>
      <div className="product-price">{product.price}</div>
      <a
        className="btn-wa"
        href={whatsappLink(product)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp /> Pedir
      </a>
    </div>
  </article>
);

export default ProductCard;
