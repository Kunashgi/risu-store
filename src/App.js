import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CatalogPage from './components/Catalog/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './components/Catalog/CategoryPage';
import AgendarCompraPage from './components/Catalog/AgendarCompraPage';
// import NotFoundPage from './pages/NotFoundPage';
// import products from './data/products.js'
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Ruta principal - Catálogo */}
            <Route path="/" element={<CatalogPage />} />
            
            {/* Ruta de detalle de producto */}
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            {/* Ruta 404 - Not Found */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/agendar-compra" element={<AgendarCompraPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;