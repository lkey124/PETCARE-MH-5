import { Link } from 'react-router-dom';
import { categories } from '../../../data/categories.js';
import './CategoryStrip.css';

export function CategoryStrip() {
  return (
    <section className="category-strip container" aria-label="Danh mục sản phẩm">
      {categories.map((category) => (
        <Link
          className="category-strip__item"
          key={category.id}
          to={category.id === 'all' ? '/products' : `/products?category=${category.id}`}
        >
          <img src={category.image} alt="" aria-hidden="true" />
          <span>{category.name}</span>
        </Link>
      ))}
    </section>
  );
}
