import React, { createContext, useState, useEffect, useRef } from 'react';
import { Toast } from '../components/common/Toast/Toast';

export const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  // 1. Lấy dữ liệu từ localStorage
  const [savedItems, setSavedItems] = useState(() => {
    const localData = localStorage.getItem('petcare_saved_items');
    return localData ? JSON.parse(localData) : [];
  });

  // 2. State quản lý thông báo (Toast)
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  
  // Dùng useRef để lưu trữ bộ đếm thời gian (giúp chống lỗi khi bấm liên tục)
  const toastTimerRef = useRef(null);

  // Tự động lưu vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('petcare_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  const isSaved = (productId) => {
    return savedItems.some(item => item.id === productId);
  };

  // Hàm hiển thị thông báo an toàn
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    
    // Nếu đang có một bộ đếm giờ cũ chạy dở thì hủy nó đi
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    
    // Đặt bộ đếm mới: Tự động tắt sau 2.5 giây
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  };

  const toggleSave = (product) => {
    // Kiểm tra xem sản phẩm đã có trong danh sách chưa
    const exists = savedItems.some(item => item.id === product.id);
    
    if (exists) {
      // Nếu đã có -> Xóa đi và báo đã bỏ lưu
      setSavedItems(prev => prev.filter(item => item.id !== product.id));
      showToast('Đã bỏ lưu sản phẩm.', 'info');
    } else {
      // Nếu chưa có -> Thêm vào và báo thành công
      setSavedItems(prev => [...prev, product]);
      showToast('Đã lưu sản phẩm thành công!', 'success');
    }
  };

  return (
    <SavedContext.Provider value={{ savedItems, toggleSave, isSaved }}>
      {children}
      
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          visible={true} 
        />
      )}
      
    </SavedContext.Provider>
  );
};