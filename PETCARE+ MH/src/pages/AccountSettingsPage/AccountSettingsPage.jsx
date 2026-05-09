import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AccountSettingsPage.css';

export default function AccountSettingsPage() {
  // 1. Dữ liệu gốc ban đầu (Cố định để so sánh)
  const initialData = {
    fullName: 'Trung Nguyễn',
    phone: '0931278627',
    address: '613 Âu cơ TP hcm',
    email: 'nguyen123@gmail.com',
    idCard: '',
    gender: 'Nữ',
    birthday: '9/7/2004'
  };

  // 2. State quản lý dữ liệu trên Form
  const [formData, setFormData] = useState(initialData);
  
  // 3. State quản lý việc cho phép sửa Email hay không
  const [canEditEmail, setCanEditEmail] = useState(false);

  // 4. Logic kiểm tra thay đổi so với ban đầu để kích hoạt nút Lưu
  // JSON.stringify là cách nhanh nhất để so sánh 2 object trong React
  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="account-settings-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div className="settings-breadcrumb">
          <Link to="/"><ChevronLeft size={18} /> Quay lại Trang chủ</Link>
          <span className="sep">/</span>
          <span>Cài đặt tài khoản</span>
        </div>

        <div className="settings-content-card">
          <h2 className="section-title">Thông tin cá nhân</h2>
          
          <div className="settings-form">
            <div className="input-field">
              <label>Họ và tên</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>

            <div className="input-field">
              <label>Số điện thoại</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="input-field">
              <label>Địa chỉ</label>
              <input name="address" value={formData.address} onChange={handleChange} />
            </div>

            {/* PHẦN EMAIL ĐẶC BIỆT */}
            <div className="email-flex-row">
              <div className="input-field flex-grow">
                <label>Email</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  disabled={!canEditEmail} // Bị khóa nếu canEditEmail là false
                  className={!canEditEmail ? 'field-locked' : ''}
                />
              </div>
              <button 
                type="button" 
                className="btn-toggle-email" 
                onClick={() => setCanEditEmail(!canEditEmail)}
              >
                {canEditEmail ? 'Hủy bỏ' : 'Thay đổi'}
              </button>
            </div>

            <div className="input-field">
              <label>CCCD/ Hộ Chiếu</label>
              <input name="idCard" value={formData.idCard} onChange={handleChange} />
            </div>

            <div className="input-row">
              <div className="input-field col-half">
                <label>Giới tính</label>
                <input name="gender" value={formData.gender} onChange={handleChange} />
              </div>
              <div className="input-field col-half">
                <label>Ngày/Tháng/Năm sinh</label>
                <input name="birthday" value={formData.birthday} onChange={handleChange} />
              </div>
            </div>

            {/* NÚT LƯU THAY ĐỔI: Đổi class 'active' nếu có thay đổi */}
            <button 
              className={`btn-save-changes ${isChanged ? 'active' : ''}`}
              disabled={!isChanged}
            >
              Lưu thay đổi
            </button>
          </div>

          <h2 className="section-title mt-40">Liên kết mạng xã hội</h2>
          <p className="social-note">Những thông tin dưới đây chỉ mang tính xác thực. Người dùng khác sẽ không thể thấy thông tin này.</p>
          
          <div className="social-links-container">
             <SocialItem icon="/images/icons/facebook.png" label="Facebook" action="Liên kết" />
             <SocialItem icon="/images/icons/google.png" label="Đã liên kết Google" action="Hủy liên kết" isLinked />
             <SocialItem icon="/images/icons/apple.png" label="Apple ID" action="Liên kết" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialItem({ icon, label, action, isLinked }) {
  return (
    <div className="social-item">
      <div className="social-left">
        <img src={icon} alt="icon" />
        <span className={isLinked ? 'text-bold' : ''}>{label}</span>
      </div>
      <button className={`btn-social-action ${isLinked ? 'text-muted' : ''}`}>{action}</button>
    </div>
  );
}