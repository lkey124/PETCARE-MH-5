import { Link } from 'react-router-dom';
import './WarrantyPage.css';

export default function WarrantyPage() {
  return (
    <div className="static-page-container">
      <div className="breadcrumb">
        &lt; <Link to="/">Quay lại</Link> &lt; <span>Bảo hành</span>
      </div>

      <div className="static-content">
        <h2>Chính sách bảo hành sản phẩm</h2>
        <p>Chúng tôi cam kết cung cấp thông tin bảo hành rõ ràng, minh bạch nhằm bảo vệ quyền lợi của khách hàng sau khi mua sắm. Tùy theo từng dòng sản phẩm, chính sách bảo hành có thể được áp dụng theo tiêu chuẩn của nhà sản xuất, nhà phân phối hoặc chính sách riêng của cửa hàng.</p>
        <p>Thời gian bảo hành, điều kiện bảo hành và hình thức xử lý sẽ được ghi rõ tại trang chi tiết sản phẩm, phiếu bảo hành hoặc các tài liệu đi kèm. Khách hàng nên lưu giữ hóa đơn mua hàng và các chứng từ liên quan để thuận tiện trong quá trình yêu cầu bảo hành sau này.</p>

        <h2>Nội dung hỗ trợ trong mục Bảo hành</h2>
        <p>Chuyên mục này bao gồm các thông tin như:</p>
        <ul>
          <li>Thời hạn bảo hành của từng nhóm sản phẩm</li>
          <li>Điều kiện áp dụng bảo hành</li>
          <li>Hướng dẫn kiểm tra thời gian bảo hành còn hiệu lực</li>
          <li>Quy trình gửi yêu cầu bảo hành</li>
          <li>Thông tin trung tâm bảo hành hoặc điểm tiếp nhận</li>
          <li>Thời gian dự kiến xử lý bảo hành</li>
          <li>Trường hợp được sửa chữa, đổi mới hoặc từ chối bảo hành</li>
        </ul>

        <h2>Điều kiện được bảo hành</h2>
        <p>Sản phẩm được xem xét bảo hành khi còn trong thời hạn bảo hành và phát sinh lỗi kỹ thuật do nhà sản xuất hoặc lỗi từ quá trình sản xuất. Trong trường hợp này, khách hàng sẽ được hướng dẫn gửi sản phẩm đến trung tâm bảo hành hoặc điểm tiếp nhận phù hợp để kiểm tra.</p>
        <p>Chúng tôi khuyến khích khách hàng mô tả rõ tình trạng lỗi, thời điểm phát sinh lỗi và cung cấp hình ảnh hoặc video nếu cần. Điều này giúp quá trình xác minh diễn ra nhanh và chính xác hơn.</p>

        <h2>Các trường hợp không thuộc phạm vi bảo hành</h2>
        <p>Bảo hành có thể không áp dụng với những trường hợp như:</p>
        <ul>
          <li>Sản phẩm bị rơi vỡ, va đập, vào nước hoặc cháy nổ do người dùng</li>
          <li>Sử dụng sai hướng dẫn hoặc sai nguồn điện, môi trường sử dụng</li>
          <li>Tự ý tháo lắp, sửa chữa hoặc thay đổi kết cấu sản phẩm</li>
          <li>Tem bảo hành, số serial hoặc thông tin nhận diện bị rách, mất hoặc không còn nguyên vẹn</li>
          <li>Hao mòn tự nhiên trong quá trình sử dụng</li>
        </ul>

        <h2>Thời gian xử lý bảo hành</h2>
        <p>Tùy thuộc vào loại sản phẩm và mức độ lỗi, thời gian xử lý bảo hành có thể khác nhau. Một số lỗi nhỏ có thể được sửa chữa nhanh trong thời gian ngắn, trong khi các trường hợp cần kiểm tra chuyên sâu hoặc gửi về hãng có thể cần thêm thời gian. Chúng tôi sẽ cố gắng cập nhật tiến độ xử lý để khách hàng theo dõi thuận tiện hơn.</p>
      </div>
    </div>
  );
}