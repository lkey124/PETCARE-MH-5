// =============================================
// PROTECTED ROUTE
// Bảo vệ các trang chỉ dành cho admin
// Nếu không phải admin → tự động redirect về trang chủ
// =============================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  // Đang kiểm tra quyền → chưa render gì
  if (loading) return null;

  // Chưa đăng nhập hoặc không phải admin → về trang chủ
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return children;
}
