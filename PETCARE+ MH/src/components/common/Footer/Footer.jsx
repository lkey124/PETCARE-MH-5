import { Facebook, Instagram, MessageCircle, Music2, Youtube } from 'lucide-react';
import './Footer.css';
import { Link, useLocation } from 'react-router-dom'; // 1. THÊM useLocation VÀO ĐÂY

// DỮ LIỆU: Đã chuyển thành mảng Object chứa name và path
const productLinks = [
  { name: 'Máy cho ăn', path: '/products' },
  { name: 'Máy lọc nước', path: '/products' },
  { name: 'Máy vệ sinh', path: '/products' },
  { name: 'Cát mèo', path: '/products' },
  { name: 'Chăm sóc lông', path: '/products' },
  { name: 'Phụ kiện', path: '/products' }
];

const supportLinks = [
  { name: 'Trung tâm hỗ trợ', path: '/support' },
  { name: 'Thông tin vận chuyển', path: '/support' },
  { name: 'Bảo hành', path: '/warranty' },
  { name: 'Liên hệ với chúng tôi', path: '/support' }
];

const legalLinks = [
  { name: 'Chính sách quyền riêng tư', path: '/legal' },
  { name: 'Điều khoản dịch vụ', path: '/legal' },
  { name: 'Chính sách cookie', path: '/legal' }
];

export function Footer() {
  const location = useLocation(); 
  
  // CẬP NHẬT ĐIỀU KIỆN MỚI:
  // Kiểm tra xem đường dẫn có bắt đầu bằng '/help-center/' và có chứa thêm chữ gì đó phía sau không.
  // - '/help-center/bao-hanh' -> true (Footer Vàng)
  // - '/help-center' -> false (Footer Trắng)
  const isYellowFooter = 
    (location.pathname.startsWith('/help-center/') && location.pathname.length > '/help-center/'.length) ||
    location.pathname.startsWith('/services') ||
        location.pathname.startsWith('/saved-products') ||
        location.pathname.startsWith('/vouchers');

  return (
    <footer className={`site-footer ${isYellowFooter ? 'site-footer--yellow' : ''}`}>
      <div className="footer-main container">
        <div className="footer-story">
          <img className="footer-logo" src="/images/figma/logo-frame.svg" alt="PetCare+" />
          <h2>Câu chuyện</h2>
          <p>
            Chúng tôi mang đến công nghệ thông minh giúp việc chăm sóc thú cưng trở nên dễ dàng,
            an toàn và hiện đại.
          </p>
          <p>
            Kết hợp phần cứng tiên tiến với AI thân thiện, giải pháp hỗ trợ chủ nuôi theo dõi sức
            khỏe, thói quen và sinh hoạt hằng ngày của thú cưng.
          </p>
        </div>

        <FooterColumn className="footer-column--products" title="Sản phẩm" links={productLinks} />
        <FooterColumn className="footer-column--support" title="Hỗ trợ" links={supportLinks} />
        <FooterColumn className="footer-column--legal" title="Pháp lý" links={legalLinks} />

        <div className="footer-certificates" aria-label="Chứng nhận">
          <img src="/images/figma/home/cert-notified-transparent.png" alt="Đã thông báo Bộ Công Thương" />
          <img src="/images/figma/home/cert-registered-transparent.png" alt="Đã đăng ký Bộ Công Thương" />
        </div>

        <div className="footer-newsletter">
          <h2>Đăng ký nhận tin</h2>
          <p>Nhận ưu đãi độc quyền và cập nhật mới nhất từ PetCare+</p>
          <form className="newsletter-form">
            <label className="sr-only" htmlFor="newsletter-email">
              Email của bạn
            </label>
            <input id="newsletter-email" type="email" placeholder="Email của bạn" />
            <button type="submit">Gửi</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom container">
        <div className="footer-socials" aria-label="Mạng xã hội">
          <a href="/" aria-label="Facebook">
            <Facebook size={28} />
          </a>
          <a href="/" aria-label="Instagram">
            <Instagram size={28} />
          </a>
          <a href="/" aria-label="Messenger">
            <MessageCircle size={28} />
          </a>
          <a href="/" aria-label="TikTok">
            <Music2 size={28} />
          </a>
          <a href="/" aria-label="YouTube">
            <Youtube size={30} />
          </a>
        </div>
        <p>© 2027 PETCARE+ LLC. ALL RIGHTS RESERVED</p>
        <nav aria-label="Liên kết chân trang">
          <Link to="/legal">Điều khoản sử dụng</Link>
          <Link to="/legal">Chính sách quyền riêng tư</Link>
          <Link to="/legal">Cookie</Link>
          <Link to="/support">Trung tâm bảo mật</Link>
        </nav>
      </div>
    </footer>
  );
}

// Xử lý dữ liệu object
function FooterColumn({ title, links, className = '' }) {
  return (
    <div className={`footer-column ${className}`}>
      <h2>{title}</h2>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}