import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Users, BarChart2, Settings, Bell, MessageCircle, ChevronDown, Menu, LogOut } from 'lucide-react';
import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  
  // Lấy chữ cái đầu tiên làm fallback
  const initials  = user?.email?.[0]?.toUpperCase() || 'A';
  const avatarUrl = user?.photoURL; // Lấy link ảnh từ Google
  
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="topbar-left">
          <button className="topbar-hamburger"><Menu size={20} /></button>
          <div className="topbar-logo-pill">
            <img src="/images/figma/logo-frame.svg" alt="PETCARE+"
              className="topbar-logo-img"
            />
          </div>
        </div>
        <div className="topbar-right">
          <button className="topbar-bell">
            <Bell size={18} />
            <span className="bell-badge">1</span>
          </button>
          <button className="topbar-contact" onClick={() => navigate('/')}>
            <MessageCircle size={15} /> Liên hệ
          </button>
          
          {/* CẬP NHẬT: Avatar trên Topbar */}
          <div className="topbar-avatar-wrap" title={user?.email}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="topbar-avatar admin-avatar-img" />
            ) : (
              <div className="topbar-avatar">{initials}</div>
            )}
            <ChevronDown size={14} className="topbar-avatar-chevron" />
          </div>
        </div>
      </header>

      <div className="admin-main">
        <aside className="admin-sidebar">
          <nav className="admin-sidebar__nav">
            <NavLink to="/admin/orders"><ShoppingBag size={18} /> Đơn hàng</NavLink>
            <NavLink to="/admin/products"><Package   size={18} /> Sản phẩm</NavLink>
            <NavLink to="/admin/customers"><Users    size={18} /> Khách hàng</NavLink>
            <NavLink to="/admin/reports"><BarChart2  size={18} /> Báo cáo</NavLink>
          </nav>
          <div className="admin-sidebar__footer" ref={settingsRef}>
            {showSettings && (
              <div className="sidebar-settings-dropdown">
                
                {/* CẬP NHẬT: Avatar trong Settings dropdown */}
                <div className="ssd-user">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="ssd-avatar admin-avatar-img" />
                  ) : (
                    <div className="ssd-avatar">{initials}</div>
                  )}
                  <span className="ssd-email">{user?.email}</span>
                </div>
                
                <button className="ssd-item ssd-logout" onClick={handleLogout}>
                  <LogOut size={15} /> Đăng xuất
                </button>
              </div>
            )}
            <button
              className={`sidebar-settings-btn${showSettings ? ' active' : ''}`}
              onClick={() => setShowSettings(v => !v)}
            >
              <Settings size={18} /> Settings
            </button>
          </div>
        </aside>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}