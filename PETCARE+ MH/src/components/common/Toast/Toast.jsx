// =============================================
// TOAST COMPONENT
// Hiển thị thông báo góc trên phải màn hình
// Tự động ẩn sau 3 giây
// Dùng: <Toast message="..." type="success|error|info" visible={true} />
// =============================================

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import './Toast.css';

// Dùng icon từ lucide-react thay vì emoji
const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  info:    <Info size={18} />,
};

export function Toast({ message, type = 'info', visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible || !message) return;

    // Hiện toast
    setShow(true);

    // Tự ẩn sau 3 giây
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, [visible, message]);

  if (!show) return null;

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span>{ICONS[type]}</span>
      <span>{message}</span>
    </div>
  );
}
