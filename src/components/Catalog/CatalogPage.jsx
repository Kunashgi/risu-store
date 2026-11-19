import React, { useMemo } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { categories } from '../../data/categories';
import { products, featuredIds } from '../../data/products';
import { useSearch } from '../../context/SearchContext';
import { whatsappLink } from '../../config';
import CategorySection from './CategorySection';
import { DeliveryStrip, HowToBuy, FloatingWhatsApp, Footer, Reviews, RatingBadge } from './Extras';
import { searchProducts } from './search';
import './styles.css';

const byId = (id) => products.find((p) => p.id === id);

const CatalogPage = () => {
  const { searchQuery, clearSearch } = useSearch();
  const featured = useMemo(() => featuredIds.map(byId).filter(Boolean), []);
  const heroImages = [byId(37), byId(26), byId(16)].filter(Boolean).map((p) => p.images[0]);

  const query = searchQuery.trim();
  const results = useMemo(() => (query ? searchProducts(products, query) : []), [query]);

  if (query) {
    return (
      <div className="page">
        <div className="results-head">
          <h2>
            {results.length} resultado{results.length === 1 ? '' : 's'} para “{query}”
          </h2>
          <button className="link-btn" onClick={clearSearch}>Limpiar</button>
        </div>
        {results.length ? (
          <CategorySection products={results} />
        ) : (
          <div className="empty">
            <p>No encontramos ese producto 😕</p>
            <a className="btn-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp /> Pregúntanos por WhatsApp
            </a>
          </div>
        )}
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <RatingBadge light />
          <h1>Lo que buscas, a buen precio y cerca de ti</h1>
          <p>Vasos Starbucks, pelotas Mikasa, cargadores Xiaomi y más. Entrega gratis en Metro Lo Blanco.</p>
          <div className="hero-actions">
            <a href="#destacados" className="btn-primary">Ver destacados</a>
            <a href={whatsappLink()} className="btn-ghost" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
        <div className="hero-collage" aria-hidden="true">
          {heroImages.map((src, i) => (
            <img key={i} src={src} alt="" className={`hero-img hero-img-${i}`} />
          ))}
        </div>
      </section>

      <DeliveryStrip />

      <CategorySection
        id="destacados"
        title="⭐ Destacados"
        subtitle="Los más pedidos de la semana"
        products={featured}
        eager={4}
      />

      <Reviews />

      {categories.map((c) => (
        <CategorySection
          key={c.id}
          title={`${c.icon} ${c.name}`}
          products={products.filter((p) => p.categoryId === c.id && !featuredIds.includes(p.id))}
          moreLink={`/category/${c.id}`}
        />
      ))}

      <HowToBuy />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default CatalogPage;
