import React from 'react';
import ProductCard from './ProductCard';
import { useSearch } from '../../context/SearchContext';
import './styles.css';

const CategorySection = ({ category, products }) => {
  const { searchQuery } = useSearch();
  
  // Filtrar productos por categoría
  let categoryProducts = products.filter(p => p.categoryId === category.id);
  
  // Si hay una búsqueda activa, filtrar también por el término de búsqueda
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    categoryProducts = categoryProducts.filter(product => {
      return product.name?.toLowerCase().includes(query);
    });
  }

  // No mostrar la sección si no hay productos después del filtro
  if (categoryProducts.length === 0) {
    return null;
  }

  return (
    <div className="page-container">
      {/* <LeftSidebar /> */}
      
      <main className="main-content">
        <section className="category-section">
          <h2>{category.name}</h2>
          <div className="products-grid">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default CategorySection;