import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

// Key dùng để lưu giỏ hàng vào localStorage
const CART_STORAGE_KEY = 'petcare_cart';

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ localStorage, nếu không có thì dùng mảng rỗng
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mỗi khi giỏ hàng thay đổi → lưu lại vào localStorage để không mất khi refresh
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Hàm Thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // HÀM MỚI: Xoá hẳn một sản phẩm khỏi giỏ hàng (Dành cho nút Xoá nếu có)
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  // ĐÃ CẬP NHẬT: Hàm tăng/giảm số lượng
  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) => {
      // Bước 1: Cộng/trừ số lượng cho sản phẩm có id tương ứng
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + amount };
        }
        return item;
      });

      // Bước 2: Chỉ giữ lại những sản phẩm có số lượng lớn hơn 0
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  // Hàm tính tổng tiền giỏ hàng
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Xóa toàn bộ giỏ hàng (gọi sau khi đặt hàng thành công)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};