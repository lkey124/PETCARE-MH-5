import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { categories as defaultCategories } from '../../../data/categories.js';
import './MegaMenu.css';

const CLOSE_DELAY = 150;

function getMenuCategories(categories) {
  return categories.filter((category) => category.id !== 'all' && category.id !== 'delivery');
}

function toChildSlug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function MegaMenu({ categories = defaultCategories, selectedCategory = 'all', onCategoryChange }) {
  const menuCategories = useMemo(() => getMenuCategories(categories), [categories]);
  const initialIndex = Math.max(
    0,
    menuCategories.findIndex((category) => category.id === selectedCategory),
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const closeTimeoutRef = useRef(null);
  const rootRef = useRef(null);

  const activeCategory = menuCategories[activeIndex] || menuCategories[0];
  const activeChildren = activeCategory?.children || [];

  function clearCloseTimeout() {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openMenu() {
    clearCloseTimeout();
    setOpen(true);
  }

  function closeMenu() {
    clearCloseTimeout();
    setOpen(false);
  }

  function scheduleClose() {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, CLOSE_DELAY);
  }

  function handleCategorySelect(categoryId) {
    onCategoryChange?.(categoryId);
    closeMenu();
  }

  function handleRootKeyDown(event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  useEffect(() => {
    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        closeMenu();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    const selectedIndex = menuCategories.findIndex((category) => category.id === selectedCategory);
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);
    }
  }, [menuCategories, selectedCategory]);

  return (
    <div
      className="mega-menu"
      ref={rootRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onKeyDown={handleRootKeyDown}
    >
      <button
        className={`mega-menu__trigger ${open ? 'is-active' : ''}`}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onFocus={openMenu}
      >
        <span>Danh mục</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      <div className={`mega-menu__panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mega-menu__left" role="menu" aria-label="Danh mục chính">
          {menuCategories.map((category, index) => (
            <button
              className={`mega-menu__main-item ${index === activeIndex ? 'is-active' : ''}`}
              key={category.id}
              type="button"
              role="menuitem"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => {
                openMenu();
                setActiveIndex(index);
              }}
              onClick={() => setActiveIndex(index)}
              tabIndex={open ? 0 : -1}
            >
              <span className="mega-menu__icon" aria-hidden="true">
                {category.icon}
              </span>
              <span>{category.name}</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="mega-menu__right">
          <div className="mega-menu__heading">
            <span className="mega-menu__icon" aria-hidden="true">
              {activeCategory?.icon}
            </span>
            <div>
              <p>Danh mục con</p>
              <h3>{activeCategory?.name}</h3>
            </div>
          </div>

          <div className="mega-menu__children" aria-label={`Danh mục con ${activeCategory?.name}`}>
            {activeChildren.map((child) => (
              <Link
                className="mega-menu__child-link"
                key={child}
                to={`/products?category=${activeCategory.id}&type=${toChildSlug(child)}`}
                onClick={() => handleCategorySelect(activeCategory.id)}
                tabIndex={open ? 0 : -1}
              >
                {child}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
