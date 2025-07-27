import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const NavItem = ({ category, onClick }) => {
  return (
    <li className="nav-item">
      <Link to={`/category/${category.id}`} className="nav-link" onClick={onClick}> 
        {category.name}
      </Link>
    </li>
  );
};

export default NavItem;