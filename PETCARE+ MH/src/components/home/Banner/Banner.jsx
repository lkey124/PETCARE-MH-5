import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Banner.css';

export function Banner() {
  return (
    <section className="home-banner container">
      <div className="home-banner__content">
        <span>PetCare+ Smart Ecosystem</span>
        <h2>Thiết bị thú cưng thông minh cho nhà hiện đại</h2>
        <p>
          Từ máy cho ăn, máy lọc nước đến khay vệ sinh tự động, mọi sản phẩm được chọn để giúp
          thú cưng sống khỏe và chủ nuôi bớt lo hơn mỗi ngày.
        </p>
        <Link to="/products" className="home-banner__cta">
          Khám phá ngay
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="home-banner__visual">
        <img src="/images/home/home-banner.png" alt="PetCare+ chăm sóc thú cưng thông minh" />
      </div>
    </section>
  );
}
