import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicePage.css';

export default function ServicePage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/services/success');
  };

  return (
    <div className="service-page-wrapper">
      {/* BANNER CHUẨN FIGMA: Có chó và mèo từ Homepage */}
      <div className="service-banner">
        <h1>Dịch Vụ PetCare</h1>
      </div>

      <div className="service-content">
        <div className="service-form-card">
          <h2 className="form-title"><span>Thông Tin Đăng ký Dịch Vụ</span></h2>

          <form onSubmit={handleSubmit} className="service-form">
            
            {/* Tăng khoảng cách giữa các Section để trang dài và thoáng hơn */}
            <div className="form-section">
              <h3>Thông tin liên lạc</h3>
              <div className="form-grid">
                <div className="input-group-modern">
                  <input type="text" placeholder="Họ Và Tên" required />
                </div>
                <div className="input-group-modern">
                  <input type="text" placeholder="Địa chỉ" required />
                </div>
                <div className="input-group-modern">
                  <input type="tel" placeholder="Số điện thoại" required />
                </div>
                <div className="input-group-modern">
                  <input type="email" placeholder="E-mail liên hệ" required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Dịch vụ</h3>
              <div className="input-with-icon-wrapper">
                <img src="/images/services/cho-con.png" alt="Icon" className="select-icon-dog" />
                <select required className="modern-select">
                  <option value="">- Chọn Dịch Vụ</option>
                  <option value="spa">Spa & Cắt tỉa chuyên nghiệp</option>
                  <option value="hotel">Khách sạn thú cưng cao cấp</option>
                  <option value="clinic">Khám sức khỏe tổng quát</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Chọn thời gian</h3>
              <div className="time-selection-grid">
                <input type="date" className="modern-date-input" required />
                <div className="time-range-group">
                  <span className="label">Khung giờ</span>
                  <select required><option>- 8:00 AM</option></select>
                  <span className="dash">—</span>
                  <select required><option>- 8:00 AM</option></select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Nội dung yêu cầu</h3>
              <div className="textarea-container">
                <textarea placeholder="- Vấn đề muốn hỗ trợ" rows="8"></textarea>
                {/* Bé chó đứng ở góc dưới bên phải textarea */}
                <img src="/images/services/con-choa.png" alt="Decor" className="textarea-dog-decor" />
              </div>
            </div>

            <div className="form-actions-area">
              <button type="submit" className="btn-confirm-service">
                <img src="/images/services/service-bag.png" alt="icon" style={{width: '24px', marginRight: '8px'}} />
                Xác nhận đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}