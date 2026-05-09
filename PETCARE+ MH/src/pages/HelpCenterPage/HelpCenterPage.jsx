import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Truck, RotateCcw, 
  ShieldCheck, CreditCard, Mail, PhoneCall, Send, Undo2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './HelpCenterPage.css';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

    const topics = [
    { id: 'dat-hang', icon: <ShoppingBag size={24} />, title: 'Đặt hàng', desc: 'Hướng dẫn mua sắm, sửa đổi đơn hàng, và các thông tin liên quan.' },
    { id: 'giao-hang', icon: <Truck size={24} />, title: 'Giao hàng', desc: 'Theo dõi đơn hàng, thời gian vận chuyển và phí giao hàng.' },
    { id: 'doi-tra', icon: <RotateCcw size={24} />, title: 'Đổi trả & Hoàn tiền', desc: 'Chính sách đổi trả, quy trình hoàn tiền và tình trạng xử lý.' },
    { id: 'bao-hanh', icon: <ShieldCheck size={24} />, title: 'Bảo hành', desc: 'Thông tin bảo hành sản phẩm, trung tâm sửa chữa và điều khoản.' },
    { id: 'thanh-toan', icon: <CreditCard size={24} />, title: 'Thanh toán', desc: 'Phương thức thanh toán, hóa đơn VAT và lỗi giao dịch.' },
    { id: 'bao-mat', icon: <ShieldCheck size={24} />, title: 'Bảo mật tài khoản', desc: 'Quản lý mật khẩu, cập nhật thông tin và bảo mật dữ liệu.' },
  ];

  return (
    <div className="help-page-wrapper">
      
      {/* 1. DẢI TRÊN CÙNG: TRÀN VIỀN VÀNG */}
      <section className="help-hero-section">
        <div className="help-hero-content">
          <h1>Chúng tôi có thể giúp gì cho bạn?</h1>
          <p>Nhập từ khóa, mã đơn hàng hoặc câu hỏi của bạn để tìm kiếm giải pháp nhanh chóng.</p>
          <div className="help-search-box">
            <Search className="h-search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm giải pháp..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 2. DẢI GIỮA: NỀN TRẮNG */}
      <div className="help-container">
        
        {/* Nút Quay Lại */}
        <div className="help-back-btn" onClick={() => navigate(-1)} title="Quay lại">
           <Undo2 size={24} color="#ffc400" />
        </div>

        {/* Chủ đề hỗ trợ */}
        <section className="help-topics-section">
          <h2 className="help-section-title">Chủ đề hỗ trợ</h2>
          <div className="help-topics-grid">
            
            {topics.map((topic, index) => (
              <div 
                key={index} 
                className="help-topic-card"
                onClick={() => navigate(`/help-center/${topic.id}`)} /* <-- THÊM DÒNG NÀY */
              >
                <div className="help-topic-icon">{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p>{topic.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Câu hỏi thường gặp */}
        <section className="help-faq-section">
          <h2 className="help-section-title">Câu hỏi thường gặp</h2>
          <div className="help-faq-list">
            <div className="help-faq-item">
              <span>Làm thế nào để thay đổi địa chỉ giao hàng sau khi đã đặt?</span>
              <span className="faq-chevron">⌄</span>
            </div>
            <div className="help-faq-item">
              <span>Bao lâu tôi nhận được tiền hoàn lại?</span>
              <span className="faq-chevron">⌄</span>
            </div>
            <div className="help-faq-item">
              <span>Chính sách đồng kiểm khi nhận hàng như thế nào?</span>
              <span className="faq-chevron">⌄</span>
            </div>
          </div>
        </section>
      </div>

      {/* 3. DẢI DƯỚI CÙNG: TRÀN VIỀN VÀNG CÙNG FORM */}
      <section className="help-contact-section">
        <div className="help-container">
          <div className="contact-header">
            <h2>Bạn vẫn cần thêm trợ giúp?</h2>
            <p>Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
          </div>

          <div className="contact-row">
            {/* Cột trái: Thông tin liên hệ */}
            <div className="contact-info-col">
              <div className="contact-info-card">
                <div className="contact-icon-wrapper"><PhoneCall size={20}/></div>
                <div>
                  <h4>Hotline Hỗ Trợ</h4>
                  <p className="c-desc">Hoạt động 24/7, kể cả Chủ nhật và ngày lễ.</p>
                  <p className="c-highlight">093256789</p>
                </div>
              </div>
              
              <div className="contact-info-card">
                <div className="contact-icon-wrapper"><Mail size={20}/></div>
                <div>
                  <h4>Email</h4>
                  <p className="c-desc">Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                  <p className="c-highlight">support@petcare.com</p>
                </div>
              </div>
            </div>

            {/* Cột phải: Form */}
            <div className="contact-form-col">
              <h3>Gửi yêu cầu hỗ trợ</h3>
              <form className="help-form">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" placeholder="Nhập họ và tên của bạn" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Địa chỉ email liên hệ" />
                </div>
                <div className="form-group">
                  <label>Chủ đề</label>
                  <select>
                    <option>Chọn chủ đề cần hỗ trợ</option>
                    <option>Giao hàng</option>
                    <option>Sản phẩm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nội dung chi tiết</label>
                  <textarea placeholder="Mô tả chi tiết vấn đề của bạn..."></textarea>
                </div>
                <button type="submit" className="btn-submit-help">Gửi yêu cầu <Send size={16}/></button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}