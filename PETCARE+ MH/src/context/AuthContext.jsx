// =============================================
// AUTH CONTEXT
// Lưu trạng thái đăng nhập toàn cục cho toàn bộ ứng dụng
// Bất kỳ component nào cũng có thể đọc user hiện tại qua useAuth()
// =============================================

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { checkIsAdmin } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);  // Thông tin user đang đăng nhập
  const [isAdmin, setIsAdmin] = useState(false); // Có phải admin không
  const [loading, setLoading] = useState(true);  // Đang kiểm tra auth hay chưa

  useEffect(() => {
    // Lắng nghe sự kiện đăng nhập / đăng xuất từ Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Có user → kiểm tra quyền admin trong Firestore
        try {
          const adminStatus = await checkIsAdmin(firebaseUser.uid);
          setIsAdmin(adminStatus);
        } catch {
          // Firestore rules chưa cấp quyền → mặc định không phải admin
          setIsAdmin(false);
        }
      } else {
        // Không có user (đã đăng xuất) → reset về mặc định
        setIsAdmin(false);
      }

      setLoading(false);
    });

    // Hủy lắng nghe khi component bị unmount (tránh memory leak)
    return () => unsubscribe();
  }, []);

  const value = { user, isAdmin, loading };

  // Không render gì cả khi đang kiểm tra trạng thái auth
  // Tránh màn hình nháy từ "chưa đăng nhập" → "đã đăng nhập"
  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tiện lợi để dùng trong component
export const useAuth = () => useContext(AuthContext);
