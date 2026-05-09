import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency'; // Giả sử bạn đã có hàm format tiền (VD: 2.350.000 VNĐ)
import './CartPage.css';

const CartPage = () => {
  // Lấy dữ liệu và hàm từ Context
  const { cartItems, updateQuantity, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    // Chuyển hướng sang trang thanh toán
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      {/* Breadcrumb điều hướng */}
      <div className="breadcrumb">
        <Link to="/">Quay lại Trang chủ</Link> &lt; <span>Giỏ hàng</span>
      </div>

      <h1 className="cart-title">Giỏ hàng của bạn ({cartItems.length})</h1>

      <div className="cart-container">
        {/* Danh sách sản phẩm */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">{formatCurrency(item.price)} </p>
              </div>
              
              {/* Nút tăng giảm số lượng */}
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">-</button>
                <span className="qty-number">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Khung Tổng Đơn Hàng bên phải */}
        <div className="cart-summary">
          <h2>Tổng đơn hàng</h2>
          <div className="summary-row">
            <span>Tạm tính</span>
            <strong>{formatCurrency(getCartTotal())} </strong>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <strong className="free-shipping">Miễn phí</strong>
          </div>
          <hr className="summary-divider" />
          <div className="summary-row total-row">
            <span>Tổng cộng</span>
            <strong className="total-price">{formatCurrency(getCartTotal())} </strong>
          </div>
          <button className="checkout-button" onClick={handleCheckoutClick}>
            Thanh toán ngay
          </button>
          <p className="checkout-note">
            Nhấn "Thanh toán" đồng nghĩa với việc bạn đồng ý tuân theo <a>Điều khoản PETCARE+</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;