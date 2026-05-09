import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, Search, Clock, Star, 
  Gift, TicketPercent, Settings, Headphones, ChevronRight, LogOut
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { logout } from '../../../services/authService';
import { Toast } from '../Toast/Toast';
import './UserMenu.css';

// 1. CẬP NHẬT: Thêm tham số isAvatar vào đây
export function UserMenu({ userIcon, isAvatar }) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast]   = useState({ message: '', type: 'info', visible: false });
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    setToast({ message: 'Đăng xuất thành công!', type: 'success', visible: true });
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div 
      className="user-menu-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      {/* Nút bấm — hiển thị tên email nếu đã đăng nhập */}
      <button className={`user-expand-btn ${isOpen ? 'active' : ''}`}>
        
        {/* 2. CẬP NHẬT: Thêm class động avatar-img nếu là ảnh thật */}
        <img src={userIcon} alt="User" className={`user-icon ${isAvatar ? 'avatar-img' : ''}`} />
        
        <span className="user-text">
          {user ? user.email.split('@')[0] : 'Đăng nhập'}
        </span>
        <ChevronRight size={16} className={`user-arrow ${isOpen ? 'rotate' : ''}`} />
      </button>

      {/* Dropdown với hiệu ứng trượt */}
      <div className={`user-dropdown-panel ${isOpen ? 'show' : ''}`}>

        {/* Nếu CHƯA đăng nhập: hiện banner mời đăng nhập */}
        {!user && (
          <div className="auth-banner-card">
            <div className="auth-banner-text">
              <h4>Chăm sóc thông minh,<br/> an tâm tận hưởng!</h4>
              <p>Đăng nhập cái đã!</p>
            </div>
            <img src="/images/figma/about/meouser.png" alt="PetCare+" className="auth-cat-img" />
            <div className="auth-actions">
              <Link to="/login" state={{ initialView: 'register' }} className="btn-outline">
                Tạo tài khoản
              </Link>
              <Link to="/login" className="btn-solid">Đăng nhập</Link>
            </div>
          </div>
        )}

        {/* Nếu ĐÃ đăng nhập: hiện thông tin user */}
        {user && (
          <div className="auth-banner-card">
            <div className="auth-banner-text">
              <h4>Xin chào!</h4>
              <p style={{ wordBreak: 'break-all' }}>{user.email}</p>
              {/* Hiện link vào Admin nếu là admin */}
              {isAdmin && (
                <Link to="/admin/orders" style={{ fontSize: '13px', color: '#e67e22', fontWeight: 600 }}>
                  Trang quản trị
                </Link>
              )}
            </div>
            <img src="/images/figma/about/meouser.png" alt="PetCare+" className="auth-cat-img" />
          </div>
        )}

        {/* Nhóm 1: Tiện ích */}
        <div className="menu-group">
          <div className="menu-title">Tiện ích</div>
          <div className="menu-list">
            <MenuItem icon={<Bookmark size={20} />} text="Sản phẩm đã lưu" to="/saved-products" />
            <MenuItem icon={<Search size={20} />} text="Tìm kiếm đã lưu" />
            <MenuItem icon={<Clock size={20} />} text="Lịch sử mua hàng" to="/orders" />
            <MenuItem icon={<Star size={20} />} text="Đánh giá của tôi" />
          </div>
        </div>

        {/* Nhóm 2: Ưu đãi, khuyến mãi */}
        <div className="menu-group">
          <div className="menu-title">Ưu đãi, khuyến mãi</div>
          <div className="menu-list">
            <MenuItem icon={<Gift size={20} />} text="PetCare+ ưu đãi" />
            
            {/* THÊM LINK VÀO NÚT MÃ GIẢM GIÁ */}
            <MenuItem icon={<TicketPercent size={20} />} text="Mã giảm giá" to="/vouchers" />
          </div>
        </div>

        {/* Nhóm 3: Khác */}
        <div className="menu-group">
          <div className="menu-title">Khác</div>
          <div className="menu-list">
            <MenuItem icon={<Settings size={20} />} text="Cài đặt tài khoản" to="/settings" />
            <MenuItem icon={<Headphones size={20} />} text="Trợ giúp" to="/help-center" />
            {/* Nút đăng xuất chỉ hiện khi đã đăng nhập */}
            {user && (
              <button className="menu-item-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} onClick={handleLogout}>
                <div className="menu-item-left">
                  <span className="menu-icon"><LogOut size={20} /></span>
                  <span className="menu-text">Đăng xuất</span>
                </div>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Component con giúp code gọn gàng, tạo ra từng dòng menu chuẩn thiết kế
function MenuItem({ icon, text, to = '#' }) {
  return (
    <Link to={to} className="menu-item-link">
      <div className="menu-item-left">
        <span className="menu-icon">{icon}</span>
        <span className="menu-text">{text}</span>
      </div>
      <ChevronRight size={18} className="menu-chevron" />
    </Link>
  );
}