import { UserMenu } from './UserMenu';
import { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Search, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { CartContext } from '../../../context/CartContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getOrdersByUser } from '../../../services/orderService.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import './Header.css';

const actionIcons = {
  calendar: '/images/figma/icons/calendar.svg',
  bell: '/images/figma/icons/bell.svg',
  cart: '/images/services/service-bag.png',
  user: '/images/figma/icons/user.svg',
};

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [activePopup, setActivePopup] = useState(null);

  const { cartItems, updateQuantity, getCartTotal } = useContext(CartContext);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const { user } = useAuth();
  
  // === 1. THÊM STATE QUẢN LÝ THÔNG BÁO VÀO HEADER ===
  const [notifications, setNotifications] = useState([
    { id: 1, sender: 'Trợ lí PeCa ✨', time: '12 phút trước', desc: 'Chúc mừng! Bạn đã đăng nhập thành công. ✨', isUnread: true },
    { id: 2, sender: 'Trợ lí PeCa ✨', time: '12 phút trước', desc: 'Chào bạn mới! tặng bạn 5 voucher khuyến mãi. 🎟️', isUnread: true }
  ]);

  // Hàm đánh dấu đã đọc
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  // Tính số lượng thông báo CHƯA ĐỌC (chỉ tính khi đã đăng nhập)
  const unreadCount = user ? notifications.filter(n => n.isUnread).length : 0;
  const [activeOrders, setActiveOrders] = useState(0);
  
  useEffect(() => {
    if (!user) { setActiveOrders(0); return; }
    getOrdersByUser(user.uid).then((orders) => {
      const count = orders.filter((o) =>
        ['pending', 'confirmed', 'processing', 'shipping'].includes(o.status)
      ).length;
      setActiveOrders(count);
    }).catch(() => {});
  }, [user]);

  // ==========================================
  // LOGIC FLOATING HEADER (CHỈ ĐỔI MÀU KÍNH)
  // ==========================================
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Khi cuộn qua 20px, kích hoạt lớp kính đục hơn để dễ nhìn
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCheckoutFlow = ['/cart', '/checkout', '/order-success'].includes(location.pathname);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (keyword.trim()) params.set('q', keyword.trim());
    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  }

  const togglePopup = (popupName) => {
    setActivePopup(prev => prev === popupName ? null : popupName);
  };

  return (
    <>
      {/* ============================================================== */}
      {/* KHỐI ĐỆM NÀY THAY THẾ CHO BODY PADDING 80px TRONG CSS TỔNG    */}
      {/* Giúp các trang dùng Header tự đẩy nội dung xuống, còn Admin thì không */}
      {/* ============================================================== */}
      <div style={{ height: '80px' }} aria-hidden="true"></div>

      {activePopup && <div className="popup-overlay" onClick={() => setActivePopup(null)}></div>}

      {/* Class is-scrolled giờ chỉ dùng để làm kính đục hơn, KHÔNG thu nhỏ */}
      <header className={`site-header glass-mode ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          
          <div className="header-left">
            <Link className="header-logo" to="/">
              <img src="/images/figma/logo-frame.svg" alt="PetCare+" />
            </Link>
            {isCheckoutFlow && (
              <div className="checkout-title-glass">
                <span>Thanh toán</span>
              </div>
            )}
          </div>

          {!isCheckoutFlow && (
            <nav className="header-nav">
              <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Trang chủ</NavLink>
              <NavLink to="/products" className={({isActive}) => isActive ? 'active' : ''}>Sản phẩm</NavLink>
              <NavLink to="/services" className={({isActive}) => isActive ? 'active' : ''}>Dịch vụ</NavLink>
              <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>Về chúng tôi</NavLink>
            </nav>
          )}

          {!isCheckoutFlow && (
            <form className="header-search-glass" onSubmit={handleSubmit}>
              <div className="search-category-glass">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">Danh mục</option>
                  <option value="food">Thức ăn</option>
                  <option value="toy">Đồ chơi</option>
                </select>
              </div>
              <div className="divider-glass"></div>
              <div className="search-input-glass">
                <Search size={16} color="#999" />
                <input 
                  type="text" 
                  placeholder="Tìm sản phẩm..." 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="search-location-glass">
                <MapPin size={14} color="#ffc400" />
                <select defaultValue="hcm">
                  <option value="hcm">Chọn khu vực</option>
                </select>
              </div>
            </form>
          )}

          <div className="header-actions">
            
            <div className="popup-wrapper">
              <button className="icon-button" onClick={() => togglePopup('calendar')}>
                <img src={actionIcons.calendar} alt="Lịch" />
              </button>
              {activePopup === 'calendar' && <CalendarPopup />}
            </div>

            {/* KHỐI NÚT CHUÔNG THÔNG BÁO */}
            <div className="popup-wrapper">
              <button 
                /* Đổi class dựa trên số lượng chưa đọc */
                className={`icon-button ${unreadCount > 0 ? 'has-badge' : ''}`} 
                onClick={() => togglePopup('notification')}
              >
                <img src={actionIcons.bell} alt="Thông báo" />
                {/* Chỉ hiện số đỏ nếu có thông báo chưa đọc */}
                {unreadCount > 0 && <span>{unreadCount}</span>}
              </button>
              
              {/* Truyền dữ liệu xuống cho Popup */}
              {activePopup === 'notification' && (
                <NotificationPopup 
                  user={user} 
                  notifications={notifications} 
                  markAsRead={markAsRead} 
                />
              )}
            </div>

            <div className="popup-wrapper">
              <button 
                className={`icon-button icon-button--dark ${totalItems > 0 ? 'has-badge' : ''}`}
                onClick={() => togglePopup('cart')}
              >
                <img src={actionIcons.cart} alt="Giỏ hàng" />
                {totalItems > 0 && <span>{totalItems > 99 ? '99+' : totalItems}</span>}
              </button>
              {activePopup === 'cart' && (
                <CartPopup 
                  cartItems={cartItems} 
                  updateQuantity={updateQuantity} 
                  getCartTotal={getCartTotal}
                  closePopup={() => setActivePopup(null)}
                />
              )}
            </div>
            
            {/* CẬP NHẬT: Kiểm tra nếu có ảnh Google thì dùng, không thì dùng icon mặc định */}
            <UserMenu 
              userIcon={user?.photoURL ? user.photoURL : actionIcons.user} 
              isAvatar={!!user?.photoURL} 
            />
          </div>
        </div>
      </header>
    </>
  );
}

/* =========================================
   CÁC COMPONENT POPUP (GIỮ NGUYÊN)
   ========================================= */

function CalendarPopup() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State quản lý danh sách công việc (Checkbox)
  const [tasks, setTasks] = useState({
    today: [
      { id: 't1', text: 'Đưa Lu đi tiêm phòng định kỳ tại phòng khám.', completed: false },
      { id: 't2', text: 'Vệ sinh tai và cắt móng.', completed: false }
    ],
    tomorrow: [
      { id: 'tm1', text: 'Mua thêm hạt và cát vệ sinh.', completed: false },
      { id: 'tm2', text: 'Theo dõi cân nặng sau khi đổi loại thức ăn mới.', completed: false }
    ],
    friday: [
      { id: 'f1', text: 'Lịch tắm và cắt tỉa lông (Grooming) lúc 15:00.', completed: false }
    ]
  });

  // Xử lý Checkbox công việc
  const toggleTask = (dayGroup, taskId) => {
    setTasks(prev => ({
      ...prev,
      [dayGroup]: prev[dayGroup].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  // Logic Lịch (Calendar)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  // Tính toán số ngày trong tháng và ngày bắt đầu
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (CN) -> 6 (T7)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Tạo mảng hiển thị lưới ngày
  const calendarDays = [];
  
  // 1. Điền các ngày của tháng trước (bị mờ)
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  
  // 2. Điền các ngày của tháng hiện tại
  const todayDate = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === todayDate.getDate() && month === todayDate.getMonth() && year === todayDate.getFullYear();
    calendarDays.push({ day: i, isCurrentMonth: true, isToday: isToday });
  }

  // 3. Điền các ngày của tháng sau cho đủ 42 ô (6 tuần)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div className="header-popup popup-calendar">
      {/* HEADER LỊCH */}
      <div className="calendar-header">
        <strong>Tháng {month + 1} / {year}</strong>
        <div className="calendar-nav">
          <button onClick={prevMonth}><ChevronLeft size={16}/></button>
          <button onClick={nextMonth}><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* LƯỚI LỊCH */}
      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="day-name">{d}</div>)}
        
        {calendarDays.map((item, index) => {
          // Gắn class CSS tương ứng
          let className = "day";
          if (!item.isCurrentMonth) className += " disabled";
          if (item.isToday) className += " active-blue"; // Làm nổi bật ngày hôm nay giống thiết kế

          return (
            <div key={index} className={className}>
              {item.day}
            </div>
          );
        })}
      </div>

      <hr className="popup-divider" />

      {/* DANH SÁCH CÔNG VIỆC */}
      <div className="task-section">
        <h4>Công việc hôm nay</h4>
        {tasks.today.map(task => (
          <label key={task.id} className="task-item" style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#999' : 'inherit' }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask('today', task.id)} /> {task.text}
          </label>
        ))}

        <h4>Công việc ngày mai</h4>
        {tasks.tomorrow.map(task => (
          <label key={task.id} className="task-item" style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#999' : 'inherit' }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask('tomorrow', task.id)} /> {task.text}
          </label>
        ))}

        <h4>Công việc thứ Sáu</h4>
        {tasks.friday.map(task => (
          <label key={task.id} className="task-item" style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#999' : 'inherit' }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask('friday', task.id)} /> {task.text}
          </label>
        ))}
      </div>

      <div className="popup-actions">
        <button className="btn-outline">Sửa ghi chú</button>
        <button className="btn-yellow">Đặt lịch báo</button>
      </div>
    </div>
  );
}

// 1. Nhận prop `user` vào component
// CẬP NHẬT: Nhận các props từ Header truyền xuống
function NotificationPopup({ user, notifications, markAsRead }) {
  return (
    <div className="header-popup popup-notification">
      <h3>Thông báo</h3>
      
      {!user ? (
        <div style={{ textAlign: 'center', color: '#888', margin: '30px 0', padding: '0 20px' }}>
          <img src="/images/figma/about/meouser.png" alt="Login required" style={{ width: '60px', opacity: 0.5, marginBottom: '10px' }} />
          <p>Vui lòng đăng nhập để xem thông báo của bạn nhé!</p>
        </div>
      ) : notifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', margin: '20px 0' }}>Không có thông báo mới.</p>
      ) : (
        notifications.map((noti) => (
          <div 
            key={noti.id} 
            className="noti-card" 
            onClick={() => markAsRead(noti.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="noti-header">
              <div className="noti-title">
                <span className="paw-icon">🐾</span> {noti.sender}
              </div>
              <div className="noti-time">
                {noti.time} 
                {noti.isUnread && <span className="red-dot"></span>}
              </div>
            </div>
            <p className="noti-desc">{noti.desc}</p>
          </div>
        ))
      )}
    </div>
  );
}

function CartPopup({ cartItems, updateQuantity, getCartTotal, closePopup }) {
  const navigate = useNavigate();

  const handleCheckout = () => {
    closePopup(); 
    navigate('/checkout'); 
  };

  return (
    <div className="header-popup popup-cart">
      <h3>Giỏ hàng của bạn</h3>
      <div className="popup-cart-items">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Giỏ hàng trống</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="mini-cart-item">
              <img src={item.image} alt={item.name} />
              <div className="mini-cart-details">
                <h4>{item.name}</h4>
                <p className="price">{formatCurrency(item.price)}</p>
                <div className="mini-qty-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mini-cart-summary">
        <div className="summary-line">
          <span>Tổng cộng:</span>
          <span className="strikethrough">000,000,000 VNĐ</span>
        </div>
        <div className="summary-line total">
          <span>🎟️ Mã giảm giá:</span>
          <span className="final-price">{formatCurrency(getCartTotal())}</span>
        </div>
        <button className="btn-yellow full-width" onClick={handleCheckout} disabled={cartItems.length === 0}>
          Thanh toán ngay
        </button>
      </div>
    </div>
  );
}