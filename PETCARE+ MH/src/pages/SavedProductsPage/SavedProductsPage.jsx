import React, { useState, useContext } from 'react';
import { Search, Star } from 'lucide-react';
import { SavedContext } from '../../context/SavedContext';
import { CartContext } from '../../context/CartContext'; // Lấy giỏ hàng
import './SavedProductsPage.css';

export default function SavedProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { savedItems, toggleSave } = useContext(SavedContext);
  const { addToCart } = useContext(CartContext); // Dùng hàm thêm giỏ hàng

  // Lọc sản phẩm theo tìm kiếm
  const filteredItems = savedItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý khi nhấn nút "+"
  const handleAddToCart = (product) => {
    // Chuyển đổi giá từ dạng chuỗi (VD: "2.150.000 VNĐ") về lại số nguyên để giỏ hàng tính toán
    const rawPrice = typeof product.price === 'string' 
      ? parseInt(product.price.replace(/[^0-9]/g, ''), 10) 
      : product.price;

    addToCart({
      id: product.id,
      name: product.name,
      price: rawPrice,
      image: product.image
    });
  };

  return (
    <div className="saved-page-wrapper">
      <div className="saved-container">
        
        <div className="saved-header">
          <h1>Sản phẩm đã lưu</h1>
          <p>{savedItems.length} sản phẩm</p>
        </div>

        <div className="saved-search-bar">
          <Search size={18} className="search-icon" color="#999" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm đã lưu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lưới sản phẩm */}
        {filteredItems.length === 0 ? (
           <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>
             Bạn chưa lưu sản phẩm nào hoặc không tìm thấy kết quả.
           </p>
        ) : (
          <div className="saved-grid">
            {filteredItems.map((product) => (
              <div key={product.id} className="saved-product-card">
                <div className="card-image-wrap">
                  <img src={product.image} alt={product.name} />
                </div>
                
                <div className="card-info">
                  {/* METADATA: Badge và Đánh giá */}
                  <div className="card-meta">
                    {product.badge ? (
                      <span className={`badge badge-${product.badgeType || 'yellow'}`}>{product.badge}</span>
                    ) : <span></span>}
                    <div className="rating">
                      <Star size={12} fill="#ffc400" color="#ffc400" />
                      <strong>{product.rating || '5.0'}</strong> ({product.reviews || '0'})
                    </div>
                  </div>
                  
                  {/* TIÊU ĐỀ & NÚT BỎ LƯU */}
                  <div className="card-title-row">
                    <h4>{product.name}</h4>
                    <button 
                      onClick={() => toggleSave(product)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {/* === SỬA ĐỔI Ở ĐÂY === */}
                      {/* Xóa style={{ width: '24px' }}, thêm className="saved-bookmark-icon" */}
                      <img src="/images/icons/da-luu.png" alt="Saved" className="saved-bookmark-icon" />
                      {/* ======================= */}
                    </button>
                  </div>
                  
                  {/* MÔ TẢ & DANH MỤC */}
                  <p className="card-desc">{product.desc}</p>
                  <span className="card-category">{product.category}</span>
                  
                  {/* GIÁ & NÚT GIỎ HÀNG */}
                  <div className="card-bottom">
                    <span className="price">{product.price}</span>
                    <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}