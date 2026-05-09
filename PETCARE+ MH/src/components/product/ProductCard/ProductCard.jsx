import { useContext } from 'react'; 
import { Plus, Star } from 'lucide-react'; // Đã xóa Bookmark vì chúng ta dùng hình ảnh
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { CartContext } from '../../../context/CartContext.jsx'; 
// 1. IMPORT SAVED CONTEXT
import { SavedContext } from '../../../context/SavedContext.jsx'; 
import './ProductCard.css';

export function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  
  // 2. LẤY HÀM VÀ BIẾN TỪ SAVED CONTEXT
  const { isSaved, toggleSave } = useContext(SavedContext);

  const outOfStock = product.inStock === false || (product.stock != null && Number(product.stock) <= 0);

  // 3. KIỂM TRA TRẠNG THÁI ĐÃ LƯU
  const saved = isSaved(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    const productToAdd = {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image
    };
    addToCart(productToAdd);
  };

  // 4. HÀM XỬ LÝ KHI BẤM NÚT LƯU
  const handleSaveClick = (e) => {
    e.preventDefault(); // Ngăn việc bị chuyển sang trang chi tiết khi ấn lưu
    // Truyền đầy đủ dữ liệu để hiển thị đẹp ở Trang Sản Phẩm Đã Lưu
    toggleSave({
      id: product.id,
      name: product.title,
      price: formatCurrency(product.price), 
      image: product.image,
      desc: product.subtitle,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews?.toLocaleString('vi-VN'),
      badge: product.badge,
      badgeType: product.badgeTone // Đổi tên biến cho khớp với file SavedProductsPage
    });
  };

  return (
    <article className={`product-card${outOfStock ? ' product-card--out-of-stock' : ''}`}>
      <Link className="product-card__image" to={`/products/${product.slug}`}>
        <img src={product.image} alt={product.title} loading="lazy" />
        {outOfStock && <span className="product-card__out-badge">Hết hàng</span>}
      </Link>

      <div className="product-card__meta">
        {product.badge ? (
          <span className={`product-card__badge product-card__badge--${product.badgeTone}`}>
            {product.badge}
          </span>
        ) : (
          <span />
        )}
        <span className="product-card__rating">
          <Star size={16} fill="currentColor" />
          {product.rating} ({product.reviews?.toLocaleString('vi-VN')})
        </span>
      </div>

      <div className="product-card__title-row">
        <Link to={`/products/${product.slug}`}>
          <h3>{product.title}</h3>
        </Link>
        
        {/* 5. CẬP NHẬT NÚT BẤM VÀ HÌNH ẢNH */}
        <button 
          className="product-card__save" 
          type="button" 
          aria-label={`Lưu ${product.title}`}
          onClick={handleSaveClick}
        >
          <img 
            src={saved ? "/images/icons/da-luu.png" : "/images/icons/chua-luu.png"} 
            alt="Save Icon" 
          />
        </button>
      </div>

      <p className="product-card__subtitle">{product.subtitle}</p>
      <span className="product-card__category">{product.category}</span>

      <div className="product-card__footer">
        <strong>{formatCurrency(product.price)}</strong>
        <button
          className="product-card__add"
          type="button"
          aria-label={`Thêm ${product.title} vào giỏ`}
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          <Plus size={28} />
        </button>
      </div>
    </article>
  );
}