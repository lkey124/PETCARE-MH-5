import './AboutPage.css';

export function AboutPage() {
  return (
    <main className="about-page">
      
      {/* KHỐI 1: CÂU CHUYỆN (Chữ trái - Ảnh phải) */}
      <section className="about-section bg-white">
        <div className="container about-row">
          <div className="about-content">
            <h2>Câu chuyện về <span className="text-highlight">Petcare+</span></h2>
            <p>
              PetCare+ tin rằng thú cưng không chỉ là vật nuôi mà còn là người bạn đồng hành thân thiết trong mỗi gia đình. Vì vậy, chúng tôi mong muốn mang đến giải pháp chăm sóc toàn diện, giúp các bé luôn khỏe mạnh, hạnh phúc và được yêu thương đúng cách mỗi ngày.
            </p>
            <p>
              Với sự tận tâm và thấu hiểu, PetCare+ đồng hành cùng chủ nuôi trong hành trình chăm sóc thú cưng, từ nhu cầu hằng ngày đến xây dựng lối sống lành mạnh, an toàn và vui vẻ. Chúng tôi cùng hướng đến việc xây dựng một cộng đồng gắn kết, nơi tình yêu và trách nhiệm với thú cưng được lan tỏa. Tại PetCare+, chất lượng, sự tận tâm và niềm tin của khách hàng luôn là giá trị cốt lõi.
            </p>
          </div>
          <div className="about-image">
            <img src="/images/figma/about/about us 2.png" alt="Câu chuyện về Petcare+" />
          </div>
        </div>
      </section>

      {/* KHỐI 2: TẦM NHÌN (Ảnh trái - Chữ phải) -> Thêm class 'reverse' */}
      <section className="about-section bg-yellow">
        <div className="container about-row reverse">
          <div className="about-content">
            <h2>Tầm nhìn</h2>
            <p>
              PETCARE+ cung cấp các sản phẩm và giải pháp công nghệ thông minh, an toàn và dễ sử dụng, giúp đơn giản hóa việc chăm sóc thú cưng. Chúng tôi không ngừng đổi mới và phát triển để mang đến trải nghiệm tốt nhất, đồng hành cùng cộng đồng yêu thú cưng và xây dựng sự gắn kết bền vững giữa thú cưng và chủ nuôi.
            </p>
          </div>
          <div className="about-image">
            <img src="/images/figma/about/about us.png" alt="Tầm nhìn PETCARE+" />
          </div>
        </div>
      </section>

      {/* KHỐI 3: SỨ MỆNH (Chữ trái - Ảnh phải) */}
      <section className="about-section bg-white">
        <div className="container about-row">
          <div className="about-content">
            <h2>Sứ mệnh</h2>
            <p>
              PETCARE+ ra đời với mục tiêu mang công nghệ hiện đại vào việc chăm sóc thú cưng, giúp người nuôi dễ dàng theo dõi, chăm sóc và bảo vệ thú cưng mọi lúc, mọi nơi.
            </p>
            <p>
              Chúng tôi tin rằng mọi thú cưng đều xứng đáng được yêu thương và chăm sóc tốt nhất. Trở thành nền tảng công nghệ chăm sóc thú cưng hàng đầu tại Việt Nam và vươn ra khu vực, xây dựng hệ sinh thái thông minh, tiện lợi và đáng tin cậy, góp phần nâng cao chất lượng cuộc sống cho thú cưng và sự an tâm cho chủ nuôi.
            </p>
          </div>
          <div className="about-image">
            <img src="/images/figma/about/about us 3.png" alt="Sứ mệnh PETCARE+" />
          </div>
        </div>
      </section>

      {/* KHỐI 4: CALL TO ACTION (CTA) CHUẨN XÁC */}
      <section className="about-cta">
        <div className="container cta-content">
          <h2>Chăm sóc thông minh,<br/> an tâm tận hưởng!</h2>
          <a href="/products" className="cta-btn">Nhận ưu đãi ngay</a>
        </div>
      </section>
      
    </main>
  );
}