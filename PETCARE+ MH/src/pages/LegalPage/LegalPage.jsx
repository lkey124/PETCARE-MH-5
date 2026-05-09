import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function LegalPage() {
  return (
    <div className="static-page-container">
      <div className="breadcrumb">
        &lt; <Link to="/">Quay lại Trang chủ</Link> &lt; <span>Pháp lý</span>
      </div>

      <div className="static-content">
        <h2>Chính sách quyền riêng tư</h2>
        <p>Chúng tôi cam kết tôn trọng và bảo vệ thông tin cá nhân của khách hàng khi truy cập và sử dụng website. Các thông tin được thu thập sẽ chỉ được sử dụng cho những mục đích cần thiết như xử lý đơn hàng, hỗ trợ khách hàng, cải thiện dịch vụ và đáp ứng các yêu cầu theo quy định pháp luật.</p>
        <p>Chúng tôi áp dụng các biện pháp phù hợp để bảo mật dữ liệu cá nhân và hạn chế truy cập trái phép. Thông tin của khách hàng sẽ không được chia sẻ cho bên thứ ba vì mục đích thương mại nếu không có sự đồng ý, trừ những trường hợp cần thiết theo quy định hoặc phục vụ việc vận hành dịch vụ.</p>

        <h2>Điều khoản dịch vụ</h2>
        <p>Khi truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản và điều kiện mà chúng tôi công bố. Các điều khoản này quy định quyền và trách nhiệm của người dùng, đồng thời đảm bảo quá trình sử dụng website diễn ra minh bạch, an toàn và đúng quy định.</p>
        <p>Chúng tôi có quyền cập nhật nội dung, điều chỉnh thông tin hoặc thay đổi điều khoản khi cần thiết để phù hợp với hoạt động thực tế và quy định pháp luật. Người dùng vui lòng theo dõi thường xuyên để cập nhật những thay đổi mới nhất.</p>

        <h2>Chính sách cookie</h2>
        <p>Website của chúng tôi sử dụng cookie để ghi nhớ tùy chọn của người dùng, hỗ trợ các chức năng cần thiết và nâng cao trải nghiệm truy cập. Cookie giúp website hoạt động hiệu quả hơn, đồng thời hỗ trợ chúng tôi phân tích hành vi sử dụng để cải thiện nội dung và dịch vụ.</p>
        <p>Người dùng có thể chủ động kiểm soát hoặc tắt cookie trong phần cài đặt trình duyệt. Tuy nhiên, việc vô hiệu hóa một số cookie có thể ảnh hưởng đến trải nghiệm và làm một số tính năng trên website hoạt động không đầy đủ.</p>
      </div>
    </div>
  );
}