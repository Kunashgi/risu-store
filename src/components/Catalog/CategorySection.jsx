import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './styles.css';

const CategorySection = ({ id, title, subtitle, products, moreLink, eager = 0 }) => {
  if (!products.length) return null;

  return (
    <section className="section" id={id}>
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {moreLink && (
          <Link to={moreLink} className="section-more">
            Ver todo ›
          </Link>
        )}
      </div>
      <div className="products-grid">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} eager={i < eager} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
