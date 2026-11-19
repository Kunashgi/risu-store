import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, featuredIds } from '../../data/products';
import { categories } from '../../data/categories';
import { useSearch } from '../../context/SearchContext';
import CategorySection from './CategorySection';
import { DeliveryStrip, HowToBuy, FloatingWhatsApp, Footer, Reviews } from './Extras';
import { searchProducts } from './search';
import './styles.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { searchQuery } = useSearch();
  const category = categories.find((c) => c.id === Number(categoryId));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="page empty">
        <p>Categoría no encontrada</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  // Destacados primero dentro de la categoría
  let list = products
    .filter((p) => p.categoryId === category.id)
    .sort((a, b) => {
      const ia = featuredIds.indexOf(a.id);
      const ib = featuredIds.indexOf(b.id);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  if (searchQuery.trim()) list = searchProducts(list, searchQuery.trim());

  return (
    <div className="page">
      <DeliveryStrip />
      <CategorySection
        title={`${category.icon} ${category.name}`}
        subtitle={`${list.length} producto${list.length === 1 ? '' : 's'}`}
        products={list}
        eager={4}
      />
      {!list.length && <div className="empty"><p>No hay productos que coincidan 😕</p></div>}
      <Reviews />
      <HowToBuy />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default CategoryPage;
