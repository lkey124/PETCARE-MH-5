import React from 'react';
import './VoucherPage.css';

// Dữ liệu mẫu (Giống hệt thiết kế Figma)
const freeshipVouchers = [
  { id: 1, title: 'Giảm tối đa 500kđ', desc: 'Số lượng có hạn', date: 'HD: 30/05/2026', icon: 'ma-freeship.png' },
  { id: 2, title: 'Giảm 80kđ', desc: 'Số lượng có hạn', date: 'HD: 30/05/2026', icon: 'ma-freeship.png' },
  { id: 3, title: 'Giảm 60kđ', desc: 'Số lượng có hạn', date: 'HD: 30/05/2026', icon: 'ma-freeship.png' },
  { id: 4, title: 'Giảm 50kđ', desc: 'Cho đơn hàng từ 2tr', date: 'HD: 30/05/2026', icon: 'ma-freeship.png' },
  { id: 5, title: 'Giảm 100kđ', desc: 'Cho đơn hàng từ 500k', date: 'HD: 30/05/2026', icon: 'ma-freeship.png' },
  { id: 6, title: 'Giảm 25kđ', desc: 'Cho đơn hàng từ 75k', date: 'HD: 30/05/2026', icon: 'ma-freeship.png' },
];

const discountVouchers = [
  { id: 7, title: 'Giảm 11% giảm tối đa 1trđ', desc: 'Cho đơn hàng tối thiểu 1trđ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
  { id: 8, title: 'Giảm 20% giảm tối đa 2trđ', desc: 'Cho đơn hàng tối thiểu 1trđ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
  { id: 9, title: 'Giảm 16% giảm tối đa 3trđ', desc: 'Cho đơn hàng tối thiểu 2.5trđ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
  { id: 10, title: 'Giảm 16% giảm tối đa 2trđ', desc: 'Cho đơn hàng tối thiểu 1trđ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
];

const loyaltyVouchers = [
  { id: 11, title: 'Miễn phí vận chuyển', desc: 'cho đơn hàng tối thiểu 0đ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
  { id: 12, title: 'Miễn phí vận chuyển', desc: 'cho đơn hàng tối thiểu 500kđ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
  { id: 13, title: 'Miễn phí vận chuyển', desc: 'cho đơn hàng tối thiểu 0đ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
  { id: 14, title: 'Miễn phí vận chuyển', desc: 'cho đơn hàng tối thiểu 0đ', date: 'HD: 30/05/2026', icon: 'ma-giam-gia.png' },
];

export default function VoucherPage() {
  return (
    <div className="voucher-page-wrapper">
      
      {/* Banner Vàng sử dụng lại hình SVG của trang chủ */}
      <div className="voucher-banner">
        <h1>Voucher Giảm Giá</h1>
      </div>

      <div className="voucher-container">
        
        {/* Phần 1: Freeship */}
        <VoucherSection title="Miễn Phí Vận Chuyển" vouchers={freeshipVouchers} type="freeship" />

        {/* Phần 2: Giảm Giá */}
        <VoucherSection title="Voucher Giảm Giá" vouchers={discountVouchers} type="discount" />

        {/* Phần 3: Khách Hàng Thân Thiết */}
        <VoucherSection title="Voucher Khách Hàng Thân Thiết" vouchers={loyaltyVouchers} type="loyalty" />

        <div className="view-more-action">
          <button className="btn-view-more">Xem thêm</button>
        </div>

      </div>
    </div>
  );
}

// Component con hiển thị từng nhóm Voucher
function VoucherSection({ title, vouchers, type }) {
  return (
    <div className="voucher-section">
      <h2 className="section-title">{title}</h2>
      <div className="voucher-grid">
        {vouchers.map(v => (
          <div key={v.id} className="voucher-card">
            {/* Tag nhỏ trên góc phải (chỉ có ở vài voucher) */}
            {type === 'freeship' && <div className="voucher-tag">Khách mới</div>}
            {type === 'discount' && <div className="voucher-tag">Special</div>}
            
            <div className="voucher-left">
              <img src={`/images/vouchers/${v.icon}`} alt="icon" />
            </div>
            
            <div className="voucher-middle">
              <span className="voucher-provider">
                {type === 'freeship' ? 'Freeship - KH Mới' : (type === 'loyalty' ? 'Freeship - KH Thân thiết' : 'SPECIAL - PetCare+')}
              </span>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
              <span className="voucher-date">{v.date}</span>
            </div>
            
            <div className="voucher-right">
              <button className="btn-save-voucher">Lưu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}