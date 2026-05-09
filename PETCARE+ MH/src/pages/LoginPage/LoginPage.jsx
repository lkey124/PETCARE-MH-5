import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginWithEmail, registerWithEmail, loginWithGoogle, checkIsAdmin } from '../../services/authService';
import { Toast } from '../../components/common/Toast/Toast';
import './LoginPage.css';

// Dinh nghia ben ngoai component, tranh remount khi re-render
function SocialButton({ icon, text, onClick }) {
  return (
    <button className="social-btn" onClick={onClick}>
      <span className="social-icon">{icon}</span>
      <span className="social-text">{text}</span>
    </button>
  );
}

function PasswordInput({ placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="password-wrapper">
      <input
        type={show ? 'text' : 'password'}
        className="auth-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button type="button" className="eye-btn" onClick={onToggle}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // view có thể là: 'main' | 'password' | 'register' | 'forgot'
  const [view, setView] = useState(location.state?.initialView || 'main');

  // State lưu dữ liệu form
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName]             = useState('');
  const [phone, setPhone]                   = useState('');

  // Toggle hiện / ẩn mật khẩu
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm,  setShowConfirm]           = useState(false);

  // State thông báo Toast
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  // Hàm hiện toast nhanh
  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
  };

  // Cập nhật lại view nếu người dùng nhấn vào nút "Tạo tài khoản" từ Header 
  // ngay trong lúc đang ở sẵn trang /login
  useEffect(() => {
    if (location.state?.initialView) {
      setView(location.state.initialView);
    }
  }, [location.state]);

  // --- XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Vui lòng nhập email và mật khẩu', 'error');
      return;
    }
    showToast('Đang đăng nhập...', 'info');
    try {
      const user = await loginWithEmail(email, password);
      showToast('Đăng nhập thành công!', 'success');
      const isAdmin = await checkIsAdmin(user.uid);
      setTimeout(() => navigate(isAdmin ? '/admin/orders' : '/'), 1000);
    } catch {
      showToast('Email hoặc mật khẩu không đúng', 'error');
    }
  };

  // --- XỬ LÝ ĐĂNG KÝ ---
  const handleRegister = async () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Mật khẩu nhập lại không khớp', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự', 'error');
      return;
    }
    showToast('Đang đăng ký...', 'info');
    try {
      await registerWithEmail(email, password, fullName, phone);
      showToast('Đăng ký thành công!', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        showToast('Email này đã được sử dụng', 'error');
      } else {
        showToast('Đăng ký thất bại, vui lòng thử lại', 'error');
      }
    }
  };

  // --- XỬ LÝ ĐĂNG NHẬP GOOGLE ---
  const handleGoogleLogin = async () => {
    showToast('Đang kết nối Google...', 'info');
    try {
      const user = await loginWithGoogle();
      showToast('Đăng nhập thành công!', 'success');
      const isAdmin = await checkIsAdmin(user.uid);
      setTimeout(() => navigate(isAdmin ? '/admin/orders' : '/'), 1000);
    } catch {
      showToast('Đăng nhập Google thất bại', 'error');
    }
  };

  const GoogleIcon = (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
  
  const FacebookIcon = (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const AppleIcon = (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path fill="#000000" d="M16.365 14.922c-.009-3.011 2.453-4.449 2.565-4.519-1.396-2.043-3.551-2.316-4.321-2.348-1.84-.187-3.606 1.082-4.544 1.082-.94 0-2.39-1.05-3.896-1.02-1.968.03-3.784 1.144-4.793 2.898-2.044 3.541-.522 8.784 1.47 11.666.969 1.401 2.112 2.97 3.633 2.916 1.464-.057 2.016-.948 3.73-.948 1.706 0 2.215.948 3.754.916 1.583-.032 2.566-1.42 3.522-2.812 1.106-1.615 1.564-3.184 1.59-3.267-.037-.015-3.003-1.15-3.01-4.564M14.887 4.148c.81-.978 1.353-2.343 1.204-3.693-1.164.047-2.585.776-3.415 1.745-.69.803-1.34 2.193-1.171 3.518 1.294.1 2.571-.607 3.382-1.57z" />
    </svg>
  );

  return (
    <main className="auth-page">
      {/* Toast thông báo đăng nhập / đăng ký */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      <div className="auth-card">
        
        {/* =========================================
            MÀN HÌNH 1: ĐĂNG NHẬP / ĐĂNG KÝ (MAIN)
            ========================================= */}
        {view === 'main' && (
          <div className="auth-view animate-fade">
            <h2 className="auth-title">Đăng nhập/Đăng ký</h2>
            
            <div className="social-login-group">
              <SocialButton icon={GoogleIcon} text="Tiếp tục với Google" onClick={handleGoogleLogin} />
              <SocialButton icon={FacebookIcon} text="Tiếp tục với Facebook" />
              <SocialButton icon={AppleIcon} text="Tiếp tục với Apple" />
            </div>

            <div className="auth-divider">
              <span>Hoặc</span>
            </div>

            <input
              type="text"
              className="auth-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <button className="auth-btn btn-primary" onClick={() => setView('password')}>
              Tiếp tục
            </button>
            <button className="auth-btn btn-primary" style={{marginTop: '16px'}} onClick={() => setView('register')}>
              Đăng ký tài khoản
            </button>
          </div>
        )}

        {/* =========================================
            MÀN HÌNH 2: NHẬP MẬT KHẨU
            ========================================= */}
        {view === 'password' && (
          <div className="auth-view animate-fade">
            <h2 className="auth-title">Vui lòng nhập mật khẩu</h2>
            <p className="auth-subtitle">Nhập mật khẩu để đăng nhập tài khoản</p>
            
            <PasswordInput
              placeholder="Mật khẩu*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
            
            <div className="auth-link-container">
              <button className="text-link" onClick={() => setView('forgot')}>
                Quên mật khẩu?
              </button>
            </div>
            
            <button className="auth-btn btn-primary" onClick={handleLogin}>Tiếp tục</button>
            <button className="text-link center-link" style={{marginTop: '20px'}} onClick={() => setView('main')}>
              Quay lại
            </button>
          </div>
        )}

        {/* =========================================
            MÀN HÌNH 3: ĐĂNG KÝ NGAY
            ========================================= */}
        {view === 'register' && (
          <div className="auth-view animate-fade">
            <h2 className="auth-title">Đăng ký ngay</h2>
            <p className="auth-subtitle">Nhập thông tin của bạn để đăng ký ngay !</p>
            
            <input
              type="text"
              className="auth-input"
              placeholder="Họ và tên*"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="tel"
              className="auth-input"
              placeholder="Số điện thoại*"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              className="auth-input"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              placeholder="Mật khẩu*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
            <PasswordInput
              placeholder="Nhập lại mật khẩu*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
            
            <div className="auth-link-container">
              <button className="text-link" onClick={() => setView('main')}>
                Quay lại trang đăng nhập
              </button>
            </div>
            
            <button className="auth-btn btn-primary" onClick={handleRegister}>Đăng ký</button>
          </div>
        )}

        {/* =========================================
            MÀN HÌNH 4: ĐẶT LẠI MẬT KHẨU
            ========================================= */}
        {view === 'forgot' && (
          <div className="auth-view animate-fade">
            <h2 className="auth-title">Đặt lại mật khẩu</h2>
            <p className="auth-subtitle">Nhập số điện thoại để đặt lại mật khẩu của bạn</p>
            
            <input type="text" className="auth-input" placeholder="Nhập số điện thoại" />
            
            <button className="auth-btn btn-primary" style={{marginTop: '16px'}}>Tiếp tục</button>
            <button className="text-link center-link" style={{marginTop: '20px'}} onClick={() => setView('password')}>
              Quay lại
            </button>
          </div>
        )}

      </div>
    </main>
  );
}