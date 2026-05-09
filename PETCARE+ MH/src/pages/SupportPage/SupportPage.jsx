import { Link } from 'react-router-dom';
import './SupportPage.css';

export default function SupportPage() {
  return (
    <div className="static-page-container">
      <div className="breadcrumb">
        &lt; <Link to="/">Quay lại Trang chủ</Link> &lt; <span>Hỗ trợ</span>
      </div>

      <div className="static-content">
        <h2>Trung tâm hỗ trợ</h2>
        <p>Trung tâm hỗ trợ là nơi cung cấp những thông tin cần thiết giúp khách hàng dễ dàng tìm hiểu và sử dụng dịch vụ của chúng tôi. Tại đây, bạn có thể tham khảo các câu hỏi thường gặp, hướng dẫn đặt hàng, thanh toán, giao nhận, đổi trả và nhiều thông tin hữu ích khác. Chúng tôi mong muốn mang đến trải nghiệm thuận tiện, rõ ràng và tiết kiệm thời gian cho khách hàng trong suốt quá trình mua sắm.</p>
        <p>Nếu bạn chưa tìm thấy nội dung phù hợp, đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng tiếp nhận và hỗ trợ. Chúng tôi cam kết phản hồi nhanh chóng, tận tâm và đưa ra giải pháp phù hợp với từng nhu cầu cụ thể.</p>

        <h2>Thông tin vận chuyển</h2>
        <p>Chúng tôi cung cấp dịch vụ vận chuyển nhanh chóng, an toàn và thuận tiện nhằm đảm bảo sản phẩm được giao đến khách hàng trong thời gian sớm nhất. Thời gian giao hàng có thể thay đổi tùy theo khu vực nhận hàng, loại sản phẩm và đơn vị vận chuyển. Sau khi đơn hàng được xác nhận, hệ thống sẽ tiến hành xử lý, đóng gói và cập nhật trạng thái để khách hàng dễ dàng theo dõi.</p>
        <p>Trong một số trường hợp như thời tiết xấu, ngày lễ hoặc quá tải đơn hàng, thời gian giao hàng có thể chậm hơn dự kiến. Chúng tôi sẽ luôn cố gắng thông báo kịp thời và hỗ trợ khách hàng trong suốt quá trình vận chuyển.</p>

        <h2>Bảo hành</h2>
        <p>Chúng tôi cam kết cung cấp sản phẩm chất lượng cùng chính sách bảo hành rõ ràng và minh bạch. Nếu sản phẩm phát sinh lỗi kỹ thuật thuộc phạm vi bảo hành, khách hàng sẽ được hỗ trợ kiểm tra, sửa chữa hoặc đổi trả theo điều kiện áp dụng. Chính sách bảo hành được xây dựng nhằm bảo vệ quyền lợi chính đáng của khách hàng trong quá trình sử dụng sản phẩm.</p>
        <p>Để việc bảo hành diễn ra thuận lợi, khách hàng nên lưu giữ hóa đơn, mã đơn hàng hoặc các giấy tờ liên quan. Chúng tôi luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc về điều kiện, thời gian và quy trình bảo hành.</p>

        <h2>Liên hệ với chúng tôi</h2>
        <p>Chúng tôi luôn trân trọng mọi câu hỏi, góp ý và phản hồi từ khách hàng. Nếu bạn cần hỗ trợ về sản phẩm, đơn hàng hoặc dịch vụ, vui lòng liên hệ với chúng tôi qua các kênh thông tin được cung cấp trên website như email, số điện thoại hoặc biểu mẫu liên hệ trực tuyến.</p>
        <p>Đội ngũ của chúng tôi sẽ tiếp nhận và phản hồi trong thời gian sớm nhất với tinh thần chuyên nghiệp, tận tâm và trách nhiệm. Sự hài lòng của khách hàng luôn là ưu tiên quan trọng trong quá trình hoạt động và phát triển của chúng tôi.</p>
      </div>
    </div>
  );
}