// =============================================
// EMAIL SERVICE
// Gửi email xác nhận đơn hàng qua EmailJS 
// Đọc config từ biến môi trường .env
// =============================================

import emailjs from "@emailjs/browser";

// Đọc key từ .env — KHÔNG hard-code trực tiếp ở đây
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// --- GỬI EMAIL XÁC NHẬN ĐƠN HÀNG ---
// Template EmailJS cần các biến: to_email, customer_name, order_id, order_items, order_total
export const sendOrderConfirmationEmail = async (orderData) => {
  // Tạo chuỗi danh sách sản phẩm để hiển thị trong email
  const itemsSummary = orderData.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join("\n");

  const templateParams = {
    to_email: orderData.userEmail,
    customer_name: orderData.fullName,
    order_id: orderData.orderId,
    order_items: itemsSummary,
    order_total:
      new Intl.NumberFormat("vi-VN").format(orderData.total) + " VND",
  };

  // Khởi tạo EmailJS với public key trước khi gửi
  emailjs.init(PUBLIC_KEY);

  const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  console.log("Email gửi thành công:", response.status, response.text);
  return response;
};
