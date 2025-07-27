import React from 'react';
import ProductCard from './ProductCard';
import './styles.css';

const CategorySection = ({ category, products }) => {
  const categoryProducts = products.filter(p => p.categoryId === category.id);

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