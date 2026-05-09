import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard/ProductCard.jsx';
import { SidebarFilter } from '../../components/product/SidebarFilter/SidebarFilter.jsx';
import { useProducts } from '../../hooks/useProducts.js';
import './ProductListPage.css';

const PAGE_SIZE = 12;

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const keyword = (searchParams.get('q') || '').toLowerCase();
  const page = Number(searchParams.get('page') || 1);
  const { products, loading } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = activeCategory === 'all' || product.categoryId === activeCategory;
      const matchKeyword =
        !keyword ||
        (product.title || '').toLowerCase().includes(keyword) ||
        (product.subtitle || '').toLowerCase().includes(keyword) ||
        (product.category || '').toLowerCase().includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [products, activeCategory, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function setPage(nextPage) {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(nextPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <section className="product-list-page container">
        <SidebarFilter activeCategory={activeCategory} />
        <div className="product-list-page__content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <p>Đang tải sản phẩm...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-list-page container">
      <SidebarFilter activeCategory={activeCategory} />

      <div className="product-list-page__content">
        <div className="product-list-page__toolbar">
          <div>
            <span>{filteredProducts.length} sản phẩm</span>
            <h2>{activeCategory === 'all' ? 'Tất cả sản phẩm' : 'Sản phẩm đã lọc'}</h2>
          </div>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="product-empty">
            <h3>Không tìm thấy sản phẩm phù hợp</h3>
            <p>Thử đổi danh mục hoặc từ khóa tìm kiếm.</p>
          </div>
        )}

        <div className="pagination" aria-label="Phân trang">
          <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} aria-label="Trang trước">
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
            <button
              className={safePage === item ? 'is-active' : ''}
              key={item}
              type="button"
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
            aria-label="Trang sau"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
