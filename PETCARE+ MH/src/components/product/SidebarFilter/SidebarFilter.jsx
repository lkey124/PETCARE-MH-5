import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '../../../data/categories.js';
import './SidebarFilter.css';

export function SidebarFilter({ activeCategory }) {
  const visibleCategories = categories.filter((category) => category.id !== 'delivery' && category.id !== 'all');

  return (
    <aside className="sidebar-filter">
      <button className="sidebar-filter__sort" type="button">
        Sắp xếp: Mới nhất
        <ChevronDown size={16} />
      </button>

      <nav className="sidebar-filter__list" aria-label="Bộ lọc danh mục">
        {visibleCategories.map((category) => (
          <Link
            className={`sidebar-filter__item ${activeCategory === category.id ? 'is-active' : ''}`}
            key={category.id}
            to={`/products?category=${category.id}`}
          >
            <img src={category.image} alt="" aria-hidden="true" />
            <span>{category.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
