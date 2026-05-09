import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './HelpTopicPage.css';

export default function HelpTopicPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  // Cuộn lên đầu trang mỗi khi vào trang chi tiết
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topicId]);

  const topicData = {
    'dat-hang': {
      title: 'Đặt hàng',
      content: (
        <>
          <h3>Đặt hàng như thế nào?</h3>
          <p>Chúng tôi xây dựng quy trình đặt hàng đơn giản, nhanh chóng và dễ thao tác để khách hàng có thể mua sắm thuận tiện trên website. Bạn chỉ cần lựa chọn sản phẩm phù hợp, thêm vào giỏ hàng, điền đầy đủ thông tin nhận hàng và xác nhận đơn hàng để hoàn tất quá trình mua sắm.</p>
          <p>Trong quá trình đặt hàng, khách hàng có thể dễ dàng xem thông tin sản phẩm, lựa chọn số lượng, màu sắc, kích thước hoặc các phiên bản khác nếu sản phẩm có nhiều tùy chọn. Trước khi xác nhận đơn, hệ thống sẽ hiển thị đầy đủ thông tin đơn hàng để bạn kiểm tra lại, bao gồm sản phẩm đã chọn, số lượng, địa chỉ nhận hàng, phí vận chuyển, mã giảm giá và tổng giá trị thanh toán.</p>
          
          <h3>Nội dung hỗ trợ trong mục Đặt hàng</h3>
          <p>Chuyên mục này sẽ giúp bạn giải đáp các vấn đề thường gặp như:</p>
          <ul>
            <li>Cách tìm kiếm sản phẩm theo tên, mã hàng hoặc danh mục</li>
            <li>Cách thêm sản phẩm vào giỏ hàng</li>
            <li>Cách thay đổi số lượng hoặc xóa sản phẩm khỏi giỏ hàng</li>
            <li>Cách áp dụng mã giảm giá, voucher hoặc chương trình ưu đãi</li>
            <li>Hướng dẫn nhập thông tin người nhận hàng</li>
            <li>Cách xác nhận đơn hàng thành công</li>
            <li>Xử lý khi không thể đặt hàng hoặc đơn hàng bị lỗi</li>
            <li>Giải thích các trạng thái của đơn hàng sau khi đặt</li>
          </ul>

          <h3>Một số lưu ý khi đặt hàng</h3>
          <p>Để đơn hàng được xử lý nhanh chóng và chính xác, khách hàng vui lòng kiểm tra kỹ các thông tin trước khi xác nhận, đặc biệt là họ tên người nhận, số điện thoại, địa chỉ giao hàng và sản phẩm đã chọn. Trường hợp nhập sai thông tin, đơn hàng có thể bị chậm xử lý hoặc giao không thành công.</p>
          <p>Sau khi đặt hàng thành công, hệ thống sẽ gửi thông báo xác nhận qua email, tin nhắn hoặc ngay trên giao diện tài khoản của bạn. Nếu bạn không nhận được thông báo xác nhận, vui lòng kiểm tra lại trạng thái đơn hàng hoặc liên hệ bộ phận chăm sóc khách hàng để được hỗ trợ.</p>
          
          <h3>Khi nào đơn hàng được xác nhận?</h3>
          <p>Thông thường, đơn hàng sẽ được xác nhận ngay sau khi bạn hoàn tất thao tác đặt mua. Tuy nhiên, trong một số trường hợp đặc biệt như sản phẩm hết hàng, sai thông tin liên hệ, thanh toán chưa thành công hoặc cần xác minh thêm thông tin, đơn hàng có thể được xử lý chậm hơn. Chúng tôi sẽ chủ động liên hệ với bạn nếu cần bổ sung hoặc xác nhận lại thông tin.</p>
        </>
      )
    },
    'giao-hang': {
      title: 'Giao hàng',
      content: (
        <>
          <h3>Chính sách giao hàng</h3>
          <p>Chúng tôi cung cấp dịch vụ giao hàng đến nhiều khu vực nhằm giúp khách hàng nhận được sản phẩm nhanh chóng, thuận tiện và an toàn. Mỗi đơn hàng sau khi được xác nhận sẽ được chuyển sang giai đoạn đóng gói và bàn giao cho đơn vị vận chuyển trong thời gian sớm nhất.</p>
          <p>Thời gian giao hàng có thể khác nhau tùy thuộc vào khu vực nhận hàng, thời điểm đặt hàng, tình trạng tồn kho của sản phẩm và lịch làm việc của đơn vị vận chuyển. Đối với các khu vực nội thành, đơn hàng thường được giao nhanh hơn. Với các khu vực ngoại thành hoặc tỉnh thành khác, thời gian nhận hàng có thể kéo dài hơn.</p>
          
          <h3>Nội dung hỗ trợ trong mục Giao hàng</h3>
          <p>Tại chuyên mục này, khách hàng có thể tìm thấy các thông tin quan trọng như:</p>
          <ul>
            <li>Thời gian xử lý đơn hàng</li>
            <li>Thời gian giao hàng dự kiến theo từng khu vực</li>
            <li>Các hình thức giao hàng đang được áp dụng</li>
            <li>Cách kiểm tra trạng thái vận chuyển</li>
            <li>Cách theo dõi mã vận đơn</li>
            <li>Hướng dẫn xử lý khi đơn giao chậm</li>
            <li>Giải đáp trường hợp giao không thành công</li>
            <li>Chính sách kiểm tra hàng khi nhận</li>
          </ul>

          <h3>Theo dõi đơn hàng</h3>
          <p>Sau khi đơn hàng được bàn giao cho đơn vị vận chuyển, bạn có thể theo dõi trạng thái giao hàng thông qua tài khoản cá nhân, email xác nhận, tin nhắn thông báo hoặc mã vận đơn được cung cấp. Tình trạng đơn hàng thường được cập nhật theo từng bước như: chờ xử lý, đã xác nhận, đang đóng gói, đã bàn giao vận chuyển, đang giao và giao thành công.</p>
          <p>Việc theo dõi đơn hàng giúp khách hàng chủ động hơn trong quá trình nhận hàng và kịp thời xử lý nếu có phát sinh trong quá trình vận chuyển.</p>
          
          <h3>Lưu ý khi nhận hàng</h3>
          <p>Khi nhận hàng, khách hàng nên kiểm tra tình trạng bên ngoài của gói hàng trước khi ký nhận. Nếu phát hiện sản phẩm có dấu hiệu bị móp méo, rách bao bì, giao sai sản phẩm hoặc thiếu số lượng, bạn nên phản hồi ngay với nhân viên giao hàng và liên hệ bộ phận hỗ trợ để được giải quyết sớm nhất.</p>
          <p>Trong một số trường hợp bất khả kháng như thời tiết xấu, thiên tai, dịch bệnh, khu vực hạn chế vận chuyển hoặc các sự cố từ đối tác giao hàng, thời gian nhận hàng có thể bị thay đổi. Chúng tôi rất mong nhận được sự thông cảm của khách hàng trong những tình huống ngoài ý muốn này.</p>
        </>
      )
    },
    'doi-tra': {
      title: 'Đổi trả & hoàn tiền',
      content: (
        <>
          <h3>Chính sách đổi trả</h3>
          <p>Chúng tôi luôn mong muốn khách hàng yên tâm khi mua sắm, vì vậy chính sách đổi trả và hoàn tiền được xây dựng minh bạch, rõ ràng và thuận tiện. Khách hàng có thể yêu cầu đổi trả trong trường hợp sản phẩm bị lỗi kỹ thuật, giao sai mẫu mã, sai kích thước, sai số lượng, thiếu phụ kiện hoặc không đúng với mô tả trên website.</p>
          <p>Mỗi yêu cầu đổi trả sẽ được tiếp nhận và kiểm tra dựa trên điều kiện cụ thể của sản phẩm cũng như thời gian gửi yêu cầu kể từ khi khách hàng nhận hàng. Chúng tôi luôn cố gắng hỗ trợ khách hàng nhanh chóng, công bằng và đúng quy định.</p>
          
          <h3>Nội dung hỗ trợ trong mục Đổi trả & Hoàn tiền</h3>
          <p>Tại đây, khách hàng sẽ được hướng dẫn chi tiết về:</p>
          <ul>
            <li>Các trường hợp được hỗ trợ đổi trả</li>
            <li>Điều kiện để sản phẩm đủ tiêu chuẩn đổi/trả</li>
            <li>Thời hạn gửi yêu cầu sau khi nhận hàng</li>
            <li>Quy trình gửi yêu cầu đổi trả</li>
            <li>Cách đóng gói và gửi lại sản phẩm</li>
            <li>Chính sách hoàn tiền và hình thức hoàn tiền</li>
            <li>Thời gian xử lý yêu cầu đổi trả</li>
            <li>Các trường hợp không áp dụng đổi trả</li>
          </ul>

          <h3>Điều kiện đổi trả sản phẩm</h3>
          <p>Để yêu cầu đổi trả được xử lý thuận lợi, sản phẩm cần đáp ứng một số điều kiện cơ bản như còn nguyên trạng, chưa qua sử dụng hoặc chỉ mới kiểm tra ở mức cần thiết, còn đầy đủ tem mác, bao bì, phụ kiện, quà tặng kèm và hóa đơn/chứng từ liên quan nếu có.</p>
          <p>Đối với sản phẩm bị lỗi, khách hàng nên cung cấp hình ảnh hoặc video thực tế để bộ phận hỗ trợ kiểm tra nhanh hơn. Việc cung cấp thông tin đầy đủ sẽ giúp rút ngắn thời gian xác minh và xử lý yêu cầu.</p>
          
          <h3>Chính sách hoàn tiền</h3>
          <p>Sau khi yêu cầu trả hàng được chấp thuận và sản phẩm đã được kiểm tra đúng điều kiện, khoản tiền hoàn sẽ được thực hiện theo phương thức thanh toán ban đầu hoặc theo hình thức khác phù hợp với từng trường hợp. Thời gian hoàn tiền có thể khác nhau tùy vào ngân hàng, ví điện tử hoặc phương thức thanh toán mà khách hàng đã sử dụng.</p>

          <h3>Những trường hợp có thể không được áp dụng đổi trả</h3>
          <p>Một số trường hợp có thể không thuộc phạm vi hỗ trợ đổi trả như:</p>
          <ul>
            <li>Sản phẩm đã qua sử dụng hoặc hư hỏng do lỗi từ phía người dùng</li>
            <li>Sản phẩm không còn đầy đủ phụ kiện, bao bì hoặc tem niêm phong</li>
            <li>Khách hàng gửi yêu cầu sau thời hạn quy định</li>
            <li>Sản phẩm thuộc danh mục không áp dụng đổi trả theo thông báo riêng</li>
            <li>Hàng bị hư hỏng do bảo quản không đúng cách hoặc tác động ngoại lực</li>
          </ul>
          <p>Chúng tôi khuyến khích khách hàng đọc kỹ chính sách trước khi gửi yêu cầu để quá trình xử lý diễn ra nhanh chóng và rõ ràng hơn.</p>
        </>
      )
    },
    'bao-hanh': {
      title: 'Bảo hành',
      content: (
        <>
          <h3>Chính sách bảo hành sản phẩm</h3>
          <p>Chúng tôi cam kết cung cấp thông tin bảo hành rõ ràng, minh bạch nhằm bảo vệ quyền lợi của khách hàng sau khi mua sắm. Tùy theo từng dòng sản phẩm, chính sách bảo hành có thể được áp dụng theo tiêu chuẩn của nhà sản xuất, nhà phân phối hoặc chính sách riêng của cửa hàng.</p>
          <p>Thời gian bảo hành, điều kiện bảo hành và hình thức xử lý sẽ được ghi rõ tại trang chi tiết sản phẩm, phiếu bảo hành hoặc các tài liệu đi kèm. Khách hàng nên lưu giữ hóa đơn mua hàng và các chứng từ liên quan để thuận tiện trong quá trình yêu cầu bảo hành sau này.</p>

          <h3>Nội dung hỗ trợ trong mục Bảo hành</h3>
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

          <h3>Điều kiện được bảo hành</h3>
          <p>Sản phẩm được xem xét bảo hành khi còn trong thời hạn bảo hành và phát sinh lỗi kỹ thuật do nhà sản xuất hoặc lỗi từ quá trình sản xuất. Trong trường hợp này, khách hàng sẽ được hướng dẫn gửi sản phẩm đến trung tâm bảo hành hoặc điểm tiếp nhận phù hợp để kiểm tra.</p>
          <p>Chúng tôi khuyến khích khách hàng mô tả rõ tình trạng lỗi, thời điểm phát sinh lỗi và cung cấp hình ảnh hoặc video nếu cần. Điều này giúp quá trình xác minh diễn ra nhanh và chính xác hơn.</p>

          <h3>Các trường hợp không thuộc phạm vi bảo hành</h3>
          <p>Bảo hành có thể không áp dụng với những trường hợp như:</p>
          <ul>
            <li>Sản phẩm bị rơi vỡ, va đập, vào nước hoặc cháy nổ do người dùng</li>
            <li>Sản phẩm sử dụng sai hướng dẫn hoặc sai nguồn điện, môi trường sử dụng</li>
            <li>Tự ý tháo lắp, sửa chữa hoặc thay đổi kết cấu sản phẩm</li>
            <li>Tem bảo hành, số serial hoặc thông tin nhận diện bị rách, mất hoặc không còn nguyên vẹn</li>
            <li>Hao mòn tự nhiên trong quá trình sử dụng</li>
          </ul>

          <h3>Thời gian xử lý bảo hành</h3>
          <p>Tùy thuộc vào loại sản phẩm và mức độ lỗi, thời gian xử lý bảo hành có thể khác nhau. Một số lỗi nhỏ có thể được sửa chữa nhanh trong thời gian ngắn, trong khi các trường hợp cần kiểm tra chuyên sâu hoặc gửi về hãng có thể cần thêm thời gian. Chúng tôi sẽ cố gắng cập nhật tiến độ xử lý để khách hàng theo dõi thuận tiện hơn.</p>
        </>
      )
    },
    'thanh-toan': {
      title: 'Thanh toán',
      content: (
        <>
          <h3>Phương thức thanh toán</h3>
          <p>Chúng tôi cung cấp nhiều hình thức thanh toán linh hoạt nhằm đáp ứng nhu cầu đa dạng của khách hàng. Tùy theo từng đơn hàng, khu vực hoặc chương trình áp dụng, bạn có thể lựa chọn phương thức thanh toán phù hợp nhất để hoàn tất giao dịch một cách an toàn và thuận tiện.</p>
          <p>Các hình thức thanh toán phổ biến bao gồm thanh toán khi nhận hàng, chuyển khoản ngân hàng, thanh toán qua thẻ nội địa, thẻ tín dụng, thẻ ghi nợ hoặc ví điện tử. Hệ thống luôn cố gắng đảm bảo quá trình thanh toán được thực hiện bảo mật và nhanh chóng.</p>

          <h3>Nội dung hỗ trợ trong mục Thanh toán</h3>
          <p>Khách hàng có thể tham khảo tại đây các thông tin như:</p>
          <ul>
            <li>Các phương thức thanh toán đang hỗ trợ</li>
            <li>Hướng dẫn thanh toán khi nhận hàng</li>
            <li>Hướng dẫn thanh toán chuyển khoản</li>
            <li>Cách thanh toán bằng thẻ ngân hàng hoặc ví điện tử</li>
            <li>Quy trình xác nhận thanh toán thành công</li>
            <li>Hướng dẫn xuất hóa đơn VAT</li>
            <li>Cách xử lý khi giao dịch bị lỗi hoặc thanh toán thất bại</li>
            <li>Các lưu ý để đảm bảo an toàn khi thanh toán trực tuyến</li>
          </ul>

          <h3>Thanh toán khi nhận hàng</h3>
          <p>Đây là phương thức phù hợp với những khách hàng muốn kiểm tra đơn hàng trước khi thanh toán. Khi lựa chọn hình thức này, bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng tại thời điểm nhận sản phẩm. Tùy từng khu vực hoặc giá trị đơn hàng, phương thức này có thể được áp dụng hoặc giới hạn theo chính sách vận chuyển hiện hành.</p>

          <h3>Thanh toán chuyển khoản và thanh toán trực tuyến</h3>
          <p>Với thanh toán chuyển khoản, khách hàng cần chuyển đúng số tiền và nội dung thanh toán theo hướng dẫn để hệ thống xác nhận nhanh hơn. Đối với thanh toán trực tuyến qua cổng thanh toán, ngân hàng hoặc ví điện tử, bạn nên kiểm tra kỹ thông tin trước khi xác nhận giao dịch để tránh nhầm lẫn.</p>
          <p>Nếu hệ thống báo lỗi thanh toán nhưng tài khoản đã bị trừ tiền, khách hàng không nên thực hiện thanh toán lặp lại nhiều lần. Hãy lưu lại thông tin giao dịch và liên hệ ngay bộ phận hỗ trợ để được kiểm tra và xử lý.</p>

          <h3>Hóa đơn VAT</h3>
          <p>Chúng tôi hỗ trợ xuất hóa đơn VAT theo yêu cầu của khách hàng. Khi cần xuất hóa đơn, vui lòng cung cấp đầy đủ và chính xác các thông tin liên quan như tên công ty, mã số thuế, địa chỉ và email nhận hóa đơn. Việc cung cấp thông tin ngay từ lúc đặt hàng sẽ giúp quá trình xuất hóa đơn được thực hiện nhanh chóng và hạn chế sai sót.</p>
        </>
      )
    },
    'bao-mat': {
      title: 'Bảo mật người dùng',
      content: (
        <>
          <h3>An toàn tài khoản và dữ liệu người dùng</h3>
          <p>Chúng tôi hiểu rằng tài khoản cá nhân và dữ liệu khách hàng là thông tin quan trọng, vì vậy luôn áp dụng các biện pháp bảo mật cần thiết nhằm hạn chế rủi ro mất quyền truy cập, rò rỉ thông tin hoặc sử dụng trái phép. Việc bảo mật tài khoản không chỉ đến từ hệ thống mà còn cần sự chủ động từ phía người dùng trong quá trình sử dụng.</p>
          
          <h3>Nội dung hỗ trợ trong mục Bảo mật tài khoản</h3>
          <p>Tại chuyên mục này, khách hàng có thể tìm thấy các hướng dẫn và thông tin quan trọng như:</p>
          <ul>
            <li>Cách đăng ký và kích hoạt tài khoản</li>
            <li>Hướng dẫn đặt mật khẩu an toàn</li>
            <li>Cách đổi mật khẩu định kỳ</li>
            <li>Hướng dẫn lấy lại mật khẩu khi quên</li>
            <li>Cập nhật thông tin cá nhân và thông tin liên hệ</li>
            <li>Nhận biết các dấu hiệu đăng nhập bất thường</li>
            <li>Cách bảo vệ tài khoản trước nguy cơ bị đánh cắp</li>
            <li>Chính sách bảo mật và sử dụng dữ liệu cá nhân</li>
          </ul>

          <h3>Khuyến nghị bảo mật cho khách hàng</h3>
          <p>Để tăng cường an toàn cho tài khoản, khách hàng nên sử dụng một mật khẩu có độ mạnh cao, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Không nên dùng các mật khẩu dễ đoán như ngày sinh, số điện thoại hoặc các chuỗi đơn giản.</p>
          <p>Bạn cũng không nên chia sẻ mật khẩu, mã OTP hoặc các thông tin xác thực tài khoản cho bất kỳ ai dưới bất kỳ hình thức nào. Trong trường hợp nhận được email, tin nhắn hoặc cuộc gọi đáng ngờ yêu cầu cung cấp thông tin cá nhân, hãy kiểm tra kỹ nguồn gửi và liên hệ ngay với bộ phận hỗ trợ nếu cần xác minh.</p>

          <h3>Khi quên mật khẩu hoặc nghi ngờ tài khoản bị xâm nhập</h3>
          <p>Nếu bạn quên mật khẩu, có thể sử dụng chức năng khôi phục mật khẩu trên website để thiết lập lại mật khẩu mới. Nếu phát hiện tài khoản có dấu hiệu bị truy cập trái phép, đơn hàng phát sinh bất thường hoặc thông tin cá nhân bị thay đổi mà không rõ nguyên nhân, vui lòng đổi mật khẩu ngay lập tức và liên hệ bộ phận hỗ trợ để được kiểm tra.</p>

          <h3>Cam kết bảo mật thông tin</h3>
          <p>Chúng tôi cam kết tôn trọng quyền riêng tư của khách hàng và chỉ thu thập, sử dụng thông tin trong phạm vi cần thiết để phục vụ hoạt động mua sắm, chăm sóc khách hàng và nâng cao chất lượng dịch vụ. Thông tin cá nhân của khách hàng được quản lý theo chính sách bảo mật hiện hành và được bảo vệ bằng các biện pháp phù hợp.</p>
        </>
      )
    }
  };

  const currentTopic = topicData[topicId];

  // Nếu người dùng gõ link sai, quay về trang Help Center chính
  if (!currentTopic) {
    navigate('/help-center');
    return null;
  }

  return (
    <div className="help-topic-wrapper">
      <div className="help-topic-container">
        
        {/* Nút Back theo đúng thiết kế */}
        <div className="topic-back-nav" onClick={() => navigate('/help-center')}>
          <ChevronLeft size={20} />
          <span>Quay lại</span>
          <ChevronLeft size={16} className="nav-separator" />
          <span className="topic-nav-title">{currentTopic.title}</span>
        </div>

        {/* Nội dung bài viết */}
        <div className="topic-content-body">
          {currentTopic.content}
        </div>

      </div>
    </div>
  );
}