import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <div className="order-success-page">
      <div className="success-container">
        <h1 className="success-title">ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p className="success-message">
          Cảm ơn bạn đã tin tưởng <span className="highlight-text">PetCare+</span><br />
          Đơn hàng của bạn đang được xử lý
        </p>

        {orderId && (
          <p style={{ fontSize: '14px', color: '#555', marginTop: '8px' }}>
            Mã đơn hàng: <strong>#{orderId}</strong>
          </p>
        )}

        <p className="success-message" style={{ fontSize: '14px', marginTop: '8px' }}>
          Email xác nhận đã được gửi về hòm thư của bạn.
        </p>
      </div>

      <div className="action-buttons">
        <Link to={orderId ? `/orders/${orderId}` : '/orders'} className="btn btn-yellow">
          Xem đơn hàng
        </Link>
        <Link to="/products" className="btn btn-outline">
          Tiếp tục mua sắm
        </Link>
        <Link to="/" className="btn btn-outline">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

