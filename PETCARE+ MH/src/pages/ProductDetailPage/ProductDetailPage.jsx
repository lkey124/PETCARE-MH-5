import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, CreditCard, Gift, Send, ShoppingCart, Star, Truck } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard/ProductCard.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { useProducts } from '../../hooks/useProducts.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import './ProductDetailPage.css';

const fallbackDescription = [
  'Thiết kế tối ưu cho gia đình nuôi thú cưng trong căn hộ hiện đại, tiết kiệm thời gian chăm sóc mà vẫn đảm bảo thú cưng luôn được chăm sóc đầy đủ.',
  'Chất liệu cao cấp, bền bỉ, dễ vệ sinh và an toàn cho vật nuôi. Các bộ phận tiếp xúc thức ăn/nước đều được làm từ vật liệu thực phẩm an toàn.',
  'Kết nối ứng dụng PetCare+ để theo dõi từ xa, điều chỉnh lịch trình và nhận cảnh báo tức thì ngay trên điện thoại.',
  'Công nghệ AI tích hợp giúp nhận diện thói quen ăn uống, tự động điều chỉnh khẩu phần phù hợp với từng giai đoạn phát triển của thú cưng.',
  'Bảo hành chính hãng 12 tháng, hỗ trợ kỹ thuật 24/7 và giao hàng nhanh toàn quốc.',
];

const defaultSpecs = [
  ['Hãng', 'Pet Care+'],
  ['Xuất xứ', 'Việt Nam'],
  ['Tình trạng', 'Hàng mới 100%'],
  ['Bảo hành', '12 tháng'],
  ['Điều khiển', 'Nút bấm vật lý và ứng dụng di động'],
  ['Nguồn điện', 'Adapter chính hãng'],
  ['Kết nối', 'Wi-Fi 2.4GHz + Bluetooth'],
  ['Ngôn ngữ', 'Tiếng Việt'],
  ['Khối lượng', 'Xem hướng dẫn sản phẩm'],
  ['Phụ kiện kèm theo', 'Adapter, sách hướng dẫn, dây cáp USB'],
];

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useContext(CartContext);

  const product = useMemo(
    () => products.find((item) => item.slug === slug) ?? null,
    [products, slug],
  );

  const outOfStock = product
    ? product.inStock === false || (product.stock != null && Number(product.stock) <= 0)
    : false;

  const gallery = useMemo(
    () => product
      ? (product.gallery?.length
          ? product.gallery
          : [product.image, ...products.slice(0, 3).map((item) => item.image)].filter(Boolean))
      : [],
    [product, products],
  );
  const [activeImage, setActiveImage] = useState(gallery[0]);

  useEffect(() => {
    setActiveImage(gallery[0]);
  }, [slug, gallery]);

  const relatedProducts = useMemo(
    () =>
      product
        ? products
            .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
            .slice(0, 5)
        : [],
    [product, products],
  );

  const specs = (() => {
    const raw = product?.specs;
    if (!Array.isArray(raw) || !raw.length) return defaultSpecs;
    if (raw[0] && typeof raw[0] === 'object' && !Array.isArray(raw[0])) {
      return raw.map(s => [s.key || '', s.value || '']);
    }
    return raw;
  })();
  const description = product?.description?.length ? product.description : fallbackDescription;

  function handleImageChange(image) {
    setActiveImage(image);
  }

  function handleAddToCart() {
    if (!product || outOfStock) return;
    addToCart({ id: product.id, name: product.title, price: product.price, image: product.image });
  }

  function handleBuyNow() {
    if (!product || outOfStock) return;
    // Truyen san pham qua navigation state, khong them vao gio hang
    navigate('/checkout', {
      state: {
        buyNowItem: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      },
    });
  }

  if (loading || !product) {
    return (
      <section className="product-detail-page container" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Đang tải sản phẩm...</p>
      </section>
    );
  }

  return (
    <section className="product-detail-page container">
      <div className="product-detail-shell">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img key={activeImage} src={activeImage} alt={product.title} />
            <span>{gallery.indexOf(activeImage) + 1}/{gallery.length}</span>
          </div>
          <div className="product-gallery__thumbs">
            {gallery.map((image) => (
              <button
                className={activeImage === image ? 'is-active' : ''}
                key={image}
                type="button"
                onClick={() => handleImageChange(image)}
                aria-label="Chọn ảnh sản phẩm"
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-panel">
          <div className="product-info-panel__badges">
            <span className={`detail-badge detail-badge--${product.badgeTone}`}>{product.badge}</span>
            <span className="detail-rating">
              <Star size={17} fill="currentColor" />
              {product.rating} ({product.reviews?.toLocaleString('vi-VN')})
            </span>
            <button type="button">
              <Bookmark size={18} fill="currentColor" />
              Lưu
            </button>
          </div>

          <h1>{product.title}</h1>
          <p className="product-info-panel__subtitle">{product.subtitle}</p>
          <strong className="product-info-panel__price">{formatCurrency(product.price)}</strong>

          <div className="offer-box">
            <h2>
              <Gift size={20} />
              Ưu đãi thanh toán
            </h2>
            <div className="offer-box__grid">
              <span>Hoàn tiền đến 2 triệu khi mở ví Pay</span>
              <span>Mở thẻ VIB nhận E-Voucher đến 600K</span>
              <span>Giảm 5% tối đa 500K khi thanh toán qua ShopeePay</span>
            </div>
          </div>

          <div className="delivery-box">
            <Truck size={20} />
            <div>
              <strong>Thông tin vận chuyển</strong>
              <p>Chọn địa chỉ giao hàng để nhận ưu đãi và thời gian dự kiến.</p>
            </div>
          </div>

          <div className="product-actions">
            {outOfStock ? (
              <button className="product-actions__buy" type="button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                Hết hàng
              </button>
            ) : (
              <button className="product-actions__buy" type="button" onClick={handleBuyNow}>
                Mua ngay
              </button>
            )}
            <button className="product-actions__cart" type="button" onClick={handleAddToCart} disabled={outOfStock}
              style={outOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
              <ShoppingCart size={20} />
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </div>

      <div className="product-detail-layout">
        {/* --- KHU VỰC THAY ĐỔI: LAYOUT DỌC (VERTICAL) --- */}
        {/* --- KHU VỰC THAY ĐỔI: LAYOUT DỌC TÁCH KHỐI --- */}
        <div className="product-details-vertical">
          
          {/* Ô 1: Mô tả chi tiết */}
          <div className="detail-box">
            <h2>Mô tả chi tiết</h2>
            <div className="desc-content">
              {description.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>

          {/* Ô 2: Thông tin chi tiết (Thông số) VÀ Thanh tìm kiếm */}
          <div className="detail-box">
            <h2>Thông tin chi tiết</h2>
            
            {/* Bảng thông số */}
            <dl className="spec-list">
              {specs.map(([name, value]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            {/* Thanh tìm kiếm đã được tinh gọn */}
            <form className="similar-search">
              {/* Dùng thuộc tính placeholder để thay thế cho thẻ label cũ */}
              <input 
                id="similar-search" 
                type="search" 
                placeholder="Bạn tìm sản phẩm tương tự?" 
                aria-label="Bạn tìm sản phẩm tương tự?"
              />
              <button type="submit">Tìm kiếm</button>
            </form>
          </div>

        </div>
        {/* --- KẾT THÚC KHU VỰC THAY ĐỔI --- */}

        <aside className="comment-panel">
          <h2>Bình luận</h2>
          <div className="comment-panel__empty">
            <CreditCard size={36} />
            <p>Chưa có bình luận nào. Hãy để lại bình luận cho người bán.</p>
          </div>
          <form className="comment-form">
            <label className="sr-only" htmlFor="comment-input">
              Bình luận
            </label>
            <input id="comment-input" type="text" placeholder="Bình luận..." />
            <button type="submit" aria-label="Gửi bình luận">
              <Send size={18} />
            </button>
          </form>
        </aside>
      </div>

      <section className="related-products">
        <div className="related-products__head">
          <h2>Sản phẩm tương tự khác</h2>
          <Link to={`/products?category=${product.categoryId}`}>Xem tất cả</Link>
        </div>
        <div className="related-products__grid">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </section>
  );
}