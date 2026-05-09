import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { saveOrder } from '../../services/orderService';
import { sendOrderConfirmationEmail } from '../../services/emailService';
import { getUserProfile } from '../../services/authService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Toast } from '../../components/common/Toast/Toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Neu co buyNowItem truyen qua state thi chi thanh toan san pham do, khong dung gio hang
  const buyNowItem = location.state?.buyNowItem ?? null;
  const orderItems = buyNowItem ? [buyNowItem] : cartItems;
  const orderTotal = buyNowItem ? buyNowItem.price * (buyNowItem.qty || 1) : getCartTotal();

  const [formData, setFormData] = useState({
    fullName:      '',
    phone:         '',
    email:         user?.email || '',
    address:       '',
    paymentMethod: 'cash',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  const showToast = (message, type = 'info') =>
    setToast({ message, type, visible: true });

  // Tự điền thông tin từ profile Firestore khi đã đăng nhập
  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((profile) => {
      if (!profile) return;
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        phone:    profile.phone    || prev.phone,
        email:    profile.email    || prev.email,
      }));
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý khi nhấn "Xác nhận đơn hàng"
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const orderData = {
        userId:        user?.uid || null,
        userEmail:     formData.email,
        fullName:      formData.fullName,
        phone:         formData.phone,
        address:       formData.address,
        paymentMethod: formData.paymentMethod,
        items:         orderItems,
        total:         orderTotal,
      };

      // Bước 1: Lưu đơn hàng vào Firestore → nhận về mã đơn hàng
      const orderId = await saveOrder(orderData);

      // Bước 2: Gửi email xác nhận (non-blocking)
      sendOrderConfirmationEmail({ ...orderData, orderId }).catch((err) =>
        console.warn('Gửi email thất bại (bỏ qua):', err),
      );

      // Buoc 3: Chi xoa gio hang neu khong phai mua ngay
      if (!buyNowItem) clearCart();

      // Bước 4: Hiện toast thành công → chờ 1.5s → chuyển trang
      showToast('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.', 'success');
      setTimeout(() => {
        navigate('/order-success', { state: { orderId } });
      }, 1500);
    } catch (err) {
      console.error('Đặt hàng thất bại:', err);
      showToast('Đặt hàng thất bại, vui lòng thử lại!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      <div className="breadcrumb">
        <Link to="/">Quay lại Trang chủ</Link> &lt; <Link to="/cart">Giỏ hàng</Link> &lt; <span>Thanh toán</span>
      </div>

      <h1 className="checkout-title">Thông tin thanh toán</h1>

      <form className="checkout-container" onSubmit={handleConfirmOrder}>
        
        {/* Cột trái: Thông tin giao hàng */}
        <div className="checkout-form-section">
          <h2>Địa chỉ giao hàng</h2>
          <div className="input-group">
            <input 
              type="text" 
              name="fullName" 
              placeholder="Họ Và Tên" 
              value={formData.fullName}
              onChange={handleInputChange}
              required 
            />
          </div>
          {/* CẬP NHẬT: Thêm class phone-input-wrapper và thẻ span chứa +84 */}
          <div className="input-group phone-input-wrapper">
            <span className="phone-prefix">+84</span>
            <input 
              type="tel" 
              name="phone" 
              placeholder="Số điện thoại" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email nhận xác nhận đơn hàng" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="text" 
              name="address" 
              placeholder="Địa chỉ" 
              value={formData.address}
              onChange={handleInputChange}
              required 
            />
          </div>

          <h2 className="mt-4">Phương thức giao hàng</h2>
          <div className="delivery-method">
            <span>Giao Hàng nhanh</span>
            <span className="free-shipping">Miễn phí</span>
          </div>
        </div>

        {/* Cột phải: Phương thức thanh toán và Tổng tiền */}
        <div className="checkout-payment-section">
          <div className="payment-methods">
            <label className={`payment-option ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              <span>Thanh toán bằng tiền mặt</span>
            </label>
            
            <label className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleInputChange}
              />
              <span>Thẻ ngân hàng/ ghi nợ</span>
            </label>

            <label className={`payment-option ${formData.paymentMethod === 'ppay' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="ppay"
                checked={formData.paymentMethod === 'ppay'}
                onChange={handleInputChange}
              />
              <span>Thanh toán bằng PPay</span>
            </label>
          </div>

          <div className="checkout-summary">
            <div className="summary-row total-row">
              <span>Tổng phí phải trả</span>
              <strong className="total-price">{formatCurrency(orderTotal)} </strong>
            </div>
            <button type="submit" className="confirm-button" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;