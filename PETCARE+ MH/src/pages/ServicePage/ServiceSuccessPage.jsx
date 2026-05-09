import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceSuccessPage.css';

export default function ServiceSuccessPage() {
  return (
    <div className="service-success-wrapper">
      <div className="success-card">
        {/* Bạn có thể thêm icon hình hộp quà mờ mờ ở đây giống thiết kế */}
        <h1>ĐĂNG KÝ THÀNH CÔNG!</h1>
        <p>Cảm ơn bạn đã tin tưởng <strong>PetCare+</strong></p>
        <p>phiếu đăng ký của bạn đang được xử lý</p>
      </div>

      <Link to="/" className="btn-back-home">
        <span className="icon">🐱</span> Về trang chủ
      </Link>
    </div>
  );
}