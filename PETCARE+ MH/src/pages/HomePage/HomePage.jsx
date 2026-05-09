import { useMemo, useRef, useState, useEffect } from 'react';
import { UtilityCard } from '../../components/home/UtilityCard/UtilityCard.jsx';
import { ShieldCheck, Smartphone, Sparkles } from 'lucide-react'; // Đã bỏ Chevron vì không dùng nữa
import { CategoryStrip } from '../../components/home/CategoryStrip/CategoryStrip.jsx';
import { FeatureCard } from '../../components/home/FeatureCard/FeatureCard.jsx';
import { ProductCard } from '../../components/product/ProductCard/ProductCard.jsx';
import { SectionHeader } from '../../components/ui/SectionHeader/SectionHeader.jsx';
import { useProducts } from '../../hooks/useProducts.js';
import { products } from '../../data/products.js';
import './HomePage.css';

const productBySlug = new Map(products.map((product) => [product.slug, product]));

const suggestImages = [
  '/images/figma/home/suggest-1.png',
  '/images/figma/home/suggest-2.png',
  '/images/figma/home/suggest-3.png',
  '/images/figma/home/suggest-4.png',
  '/images/figma/home/suggest-5.png',
];

const featuredProducts = [
  {
    ...productBySlug.get('may-cho-an-tu-dong-petkit-yumshare-solo'),
    image: '/images/figma/home/product-1.png',
  },
  {
    ...productBySlug.get('may-don-ve-sinh-petkit-purobot-crystal-duo'),
    image: '/images/figma/home/product-2.png',
  },
  {
    id: 'airsalon-max-pro',
    slug: 'may-cham-soc-long-petkit-airclipper-grooming',
    title: 'Lồng sấy Petkit Airsalon Max Pro',
    subtitle: 'Lồng sấy Petkit',
    category: 'Chăm sóc lông',
    categoryId: 'grooming',
    price: 2000000,
    rating: 4.8,
    reviews: 1345,
    badge: 'Bán chạy',
    badgeTone: 'sale',
    image: '/images/figma/home/product-3.png',
  },
  {
    ...productBySlug.get('tong-do-cat-long-2-in-1-petkit-pro'),
    image: '/images/figma/home/product-4.png',
  },
  {
    ...productBySlug.get('cat-dau-nanh-max-clean'),
    image: '/images/figma/home/product-5.png',
  },
];

const serviceCards = [
  {
    title: 'Chăm sóc lông',
    image: '/images/figma/home/service-grooming.png',
    description: 'Tắm, sấy và cắt tỉa cho thú cưng với quy trình nhẹ nhàng.',
  },
  {
    title: 'Sửa chữa dụng cụ',
    image: '/images/figma/home/service-repair.png',
    description: 'Kiểm tra thiết bị pet-tech, vệ sinh linh kiện và bảo trì định kỳ.',
  },
  {
    title: 'Lưu trú thú cưng',
    image: '/images/figma/home/service-boarding.png',
    description: 'Không gian sạch, an toàn và có người theo dõi khi bạn đi xa.',
  },
];

const utilityCards = [
  {
    title: 'Camera AI',
    image: '/images/figma/home/utility-camera.png',
    description: 'Theo dõi thói quen sinh hoạt và phát hiện bất thường theo thời gian thực.',
    icon: ShieldCheck,
  },
  {
    title: 'Kết nối App',
    image: '/images/figma/home/utility-app.png',
    description: 'Điều khiển lịch ăn, lượng nước và trạng thái thiết bị ngay trên điện thoại.',
    icon: Smartphone,
  },
  {
    title: 'Phân tích dữ liệu',
    image: '/images/figma/home/utility-data.png',
    description: 'Tổng hợp dữ liệu để chủ nuôi hiểu rõ hơn về sức khỏe thú cưng.',
    icon: Sparkles,
  },
];

const testimonials = [
  {
    name: 'Huỳnh Quốc Tuấn',
    role: '3D Designer',
    quote: 'Máy cho ăn tự động hoạt động rất tốt, dễ cài đặt và tiện lợi. Bé thú cưng nhà mình thích nghi nhanh. Chất lượng sản phẩm xứng đáng với giá tiền.',
    avatar: '/images/figma/home/anh huynh quoc tuan.png',
  },
  {
    name: 'Đặng Văn Lực',
    role: 'Fullstack Developer',
    quote: 'Website hiện đại, dễ tìm kiếm sản phẩm. Các thiết bị thông minh cho thú cưng rất hữu ích, giúp mình tiết kiệm thời gian chăm sóc.',
    avatar: '/images/figma/home/anh dang van luc.png',
  },
  {
    name: 'Nguyễn Thị Diệu Anh',
    role: 'University Lecturer',
    quote: 'Sản phẩm tốt, sử dụng ổn định. Chỉ mong shop nên bổ sung thêm nhiều mẫu mã và chương trình ưu đãi hơn trong tương lai.',
    avatar: '/images/figma/home/anh nguyen thi dieu anh.png',
  },
  {
    name: 'Đỗ Minh Trung',
    role: 'Artist Designer',
    quote: 'Nhân viên hỗ trợ tư vấn nhiệt tình, giải đáp nhanh các thắc mắc trước khi mua. Trải nghiệm mua hàng chuyên nghiệp và đáng tin cậy.',
    avatar: '/images/figma/home/anh do minh trung.png',
  },
];

export function HomePage() {
  const { products: firestoreProducts } = useProducts();
  const carouselRef = useRef(null);

  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowPrev(scrollLeft > 5); 
      setShowNext(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [firestoreProducts]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const firestoreBySlug = useMemo(() => {
    const map = new Map();
    firestoreProducts.forEach((p) => { if (p.slug && !map.has(p.slug)) map.set(p.slug, p); });
    return map;
  }, [firestoreProducts]);

  const mergedFeaturedProducts = useMemo(() => {
    return featuredProducts.map((p) => {
      const live = firestoreBySlug.get(p.slug);
      if (!live) return p;
      return { ...p, inStock: live.inStock, stock: live.stock };
    });
  }, [firestoreBySlug]);

  return (
    <>
      <CategoryStrip />

      <section className="home-suggest container section-block">
        <div className="home-suggest__header">
          <h2>
            Dành cho bạn
            <span aria-hidden="true">+</span>
          </h2>
          <span>Mới nhất</span>
        </div>
        <div className="home-suggest__gallery" aria-label="Sản phẩm gợi ý">
          {suggestImages.map((image, index) => (
            <img key={image} src={image} alt={`Gợi ý sản phẩm ${index + 1}`} />
          ))}
        </div>
      </section>

      {/* SẢN PHẨM NỔI BẬT VỚI LOGO CHÂN MÈO ĐỐI XỨNG */}
      <section className="home-products section-block">
        <div className="home-band container">Sản phẩm nổi bật</div>
        <div className="container product-carousel-wrapper">
          
          {/* Nút TRÁI: ĐÃ ĐỔI THÀNH ICON CHÂN VÀNG (LẬT NGƯỢC) */}
          {showPrev && (
            <button className="product-nav-btn prev-btn" onClick={() => scroll('left')}>
              <img 
                src="/images/figma/icons/chan vangg.png" 
                alt="Lướt qua trái" 
                className="paw-nav-icon paw-nav-icon--flip"
              />
            </button>
          )}
          
          {/* Nút PHẢI: ICON CHÂN VÀNG */}
          {showNext && (
            <button className="product-nav-btn next-btn" onClick={() => scroll('right')}>
              <img 
                src="/images/figma/icons/chan vangg.png" 
                alt="Lướt qua phải" 
                className="paw-nav-icon"
              />
            </button>
          )}

          <div className="home-product-grid" ref={carouselRef} onScroll={handleScroll}>
            {mergedFeaturedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="home-services section-block">
        <div className="home-band container">Dịch vụ thú cưng</div>
        <div className="home-feature-grid container">
          {serviceCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="home-band container">Tiện ích chung</div>
        <div className="home-utility-grid container">
          {utilityCards.map((card) => (
            <UtilityCard 
              key={card.title} 
              title={card.title}
              image={card.image}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      </section>

      <section id="about" className="home-about container section-block">
        <h2>PetCare+ Chăm sóc thông minh, an tâm tận hưởng!</h2>
      <p>
        <strong>PetCare+</strong> là nền tảng thương mại điện tử chuyên cung cấp các <span style={{ color: '#007bff' }}>thiết bị công nghệ thông minh dành cho thú cưng,</span> bao gồm máy cho ăn tự động, thiết bị theo dõi sức khỏe cùng nhiều sản phẩm tiện ích hiện đại khác.
      </p>
      <p>
        Chúng tôi mong muốn mang đến <span style={{ color: '#007bff' }}>trải nghiệm mua sắm trực tuyến tiện lợi, thân thiện và dễ sử dụng,</span> đồng thời hỗ trợ người nuôi chăm sóc thú cưng hiệu quả hơn thông qua những giải pháp công nghệ tiên tiến.
      </p>
      <p>
        <strong>Sứ mệnh:</strong>
        <br />
        Nâng cao chất lượng chăm sóc thú cưng bằng công nghệ hiện đại.
      </p>
      <p>
        <strong>Tầm nhìn:</strong>
        <br />
        Trở thành nền tảng mua sắm pet-tech hàng đầu tại Việt Nam.
      </p>
      </section>

      <section className="home-testimonials container section-block">
        <SectionHeader eyebrow="Khách hàng đánh giá, trải nghiệm" title="Khách hàng nói gì về chúng tôi" />
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <span className="testimonial-card__quote">“</span>
              <div className="testimonial-card__stars">★★★★★</div>
              <p>{testimonial.quote}</p>
              <div className="testimonial-card__person">
                <img src={testimonial.avatar} alt="" aria-hidden="true" />
                <div>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-final-cta">
        <div className="container">
          <h2>Chăm sóc thông minh, an tâm tận hưởng!</h2>
          <a href="/products">Nhận ưu đãi ngay</a>
        </div>
      </section>
    </>
  );
}