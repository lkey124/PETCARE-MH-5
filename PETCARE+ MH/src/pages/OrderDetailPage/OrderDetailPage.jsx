import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ClipboardList, Package, Truck, Home, Star,
  MapPin, Phone, User, ChevronLeft, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOrderById, updateOrderStatus } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import './OrderDetailPage.css';

/* Bước theo dõi đơn hàng */
const STEPS = [
  { key: 'placed',     label: 'Đơn hàng đã đặt',     icon: ClipboardList },
  { key: 'preparing',  label: 'Đang chuẩn bị hàng',  icon: Package },
  { key: 'shipping',   label: 'Vận chuyển',           icon: Truck },
  { key: 'delivering', label: 'Chờ giao hàng',        icon: Home },
  { key: 'done',       label: 'Đánh giá',             icon: Star },
];

const STATUS_TO_STEP = {
  pending:    1,
  confirmed:  2,
  processing: 3,
  delivered:  4,
  cancelled:  -1,
};

const STATUS_MAP = {
  pending:    { label: 'Đặt hàng thành công', sub: 'Đơn hàng đã được đặt', cls: 'ods-pending' },
  confirmed:  { label: 'Đã xác nhận',         sub: 'Đơn hàng đang được chuẩn bị', cls: 'ods-confirmed' },
  processing: { label: 'Đang vận chuyển',     sub: 'Đơn hàng đang trên đường giao', cls: 'ods-processing' },
  delivered:  { label: 'Đã giao hàng',        sub: 'Bạn đã nhận được đơn hàng', cls: 'ods-delivered' },
  cancelled:  { label: 'Đã hủy đơn',          sub: 'Đơn hàng đã bị hủy', cls: 'ods-cancelled' },
};

function formatDateTime(ts) {
  if (!ts) return '';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const mo  = String(d.getMonth() + 1).padStart(2, '0');
  const yr  = d.getFullYear();
  return `${hh}:${mm} ${day}-${mo}-${yr}`;
}

function addDays(ts, days) {
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function formatShortDate(d) {
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getOrderById(id).then(found => {
      if (!found) navigate('/orders');
      else setOrder(found);
    }).catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  async function handleCancel() {
    setCancelling(true);
    await updateOrderStatus(id, 'cancelled');
    setOrder(o => ({ ...o, status: 'cancelled' }));
    setCancelling(false);
    setShowConfirm(false);
  }

  if (loading) return (
    <div className="odp-loading">
      <div className="odp-spinner" />
      <p>Đang tải đơn hàng...</p>
    </div>
  );

  if (!order) return null;

  const activeStep = STATUS_TO_STEP[order.status] ?? 1;
  const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
  // Hủy được khi: chờ xử lý hoặc đã xác nhận (chưa bắt đầu vận chuyển)
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  const estimateFrom = order.createdAt ? addDays(order.createdAt, 3) : null;
  const estimateTo   = order.createdAt ? addDays(order.createdAt, 5) : null;

  return (
    <div className="odp-page">
      <div className="odp-container">
        {/* Back link */}
        <Link to="/orders" className="odp-back">
          <ChevronLeft size={16} /> Lịch sử mua hàng
        </Link>

        {/* Progress timeline */}
        <div className="odp-timeline">
          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < activeStep;
            const isCurrent   = stepNum === activeStep;
            const Icon = step.icon;
            return (
              <div key={step.key} className="odp-step-wrap">
                {idx > 0 && (
                  <div className={`odp-line${isCompleted || isCurrent ? ' done' : ''}`} />
                )}
                <div className={`odp-step ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending-step'}`}>
                  <div className="odp-step-circle">
                    <Icon size={18} />
                  </div>
                  <div className="odp-step-label">{step.label}</div>
                  {(isCompleted || isCurrent) && order.createdAt && (
                    <div className="odp-step-time">
                      {formatDateTime(order.createdAt)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="odp-body">
          {/* Left: address */}
          <div className="odp-card odp-address-card">
            <h3 className="odp-card-title">Địa Chỉ Nhận Hàng</h3>
            <div className="odp-address-info">
              <div className="odp-addr-row">
                <User size={15} className="odp-addr-icon" />
                <span className="odp-addr-name">{order.fullName}</span>
              </div>
              <div className="odp-addr-row">
                <Phone size={15} className="odp-addr-icon" />
                <span>{order.phone}</span>
              </div>
              <div className="odp-addr-row">
                <MapPin size={15} className="odp-addr-icon" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          {/* Right: status info */}
          <div className="odp-card odp-status-card">
            {order.status === 'processing' && (
              <span className="odp-badge-fast">Nhanh</span>
            )}
            <p className="odp-status-time">{formatDateTime(order.createdAt)}</p>
            <p className={`odp-status-label ${st.cls}`}>{st.label}</p>
            <p className="odp-status-sub">{st.sub}</p>
            {order.status !== 'cancelled' && (
              <p className="odp-dongkiem">
                Được đồng kiểm. <a href="#" className="odp-link">Tìm hiểu thêm</a>
              </p>
            )}
          </div>
        </div>

        {/* Delivery estimate + actions */}
        {order.status !== 'cancelled' && (
          <div className="odp-delivery-row">
            <div className="odp-delivery-info">
              {estimateFrom && (
                <p className="odp-delivery-date">
                  Ngày nhận hàng dự kiến{' '}
                  <strong>{formatShortDate(estimateFrom)} - {formatShortDate(estimateTo)}</strong>
                </p>
              )}
              <p className="odp-voucher-note">
                <span className="odp-voucher-dot" />
                Giao nhanh đúng hẹn: Nhận ngay voucher 15.000đ nếu đơn được giao đến bạn sau ngày {estimateTo ? formatShortDate(estimateTo) : ''}
              </p>
            </div>
            <div className="odp-action-btns">
              <button className="odp-btn-contact">
                <MessageCircle size={15} /> Liên Hệ
              </button>
              {canCancel && (
                <button
                  className="odp-btn-cancel"
                  onClick={() => setShowConfirm(true)}
                  disabled={cancelling}
                >
                  Hủy Đơn Hàng
                </button>
              )}
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="odp-summary-card">
          <h3 className="odp-summary-title">Chi tiết đơn hàng</h3>
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="odp-summary-item">
              <img
                src={item.image || '/images/brand/logo.svg'}
                alt={item.title}
                className="odp-summary-img"
                onError={e => { e.target.src = '/images/brand/logo.svg'; }}
              />
              <div className="odp-summary-info">
                <p className="odp-summary-name">{item.title}</p>
                {item.qty > 1 && <p className="odp-summary-qty">x{item.qty}</p>}
              </div>
              <p className="odp-summary-price">{formatCurrency(item.price * (item.qty || 1))}</p>
            </div>
          ))}
          <div className="odp-summary-rows">
            <div className="odp-summary-row">
              <span>Tổng tiền hàng</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="odp-summary-row">
              <span>Phí vận chuyển</span>
              <span className="odp-free">MIỄN PHÍ</span>
            </div>
            <div className="odp-summary-row">
              <span>Voucher từ PetCare+</span>
              <span>0 VND</span>
            </div>
            <div className="odp-summary-row odp-summary-total">
              <span>Thành tiền</span>
              <span className="odp-grand-total">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm cancel modal */}
      {showConfirm && (
        <div className="odp-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="odp-modal" onClick={e => e.stopPropagation()}>
            <h3>Hủy đơn hàng?</h3>
            <p>Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.</p>
            <div className="odp-modal-actions">
              <button className="odp-modal-no" onClick={() => setShowConfirm(false)}>Không</button>
              <button className="odp-modal-yes" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
