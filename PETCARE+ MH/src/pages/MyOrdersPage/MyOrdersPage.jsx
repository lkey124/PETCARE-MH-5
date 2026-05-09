import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUser } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import './MyOrdersPage.css';

const TABS = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipping',   label: 'Đang giao' },
  { key: 'delivered',  label: 'Đã giao' },
  { key: 'cancelled',  label: 'Đã hủy' },
];

const STATUS_MAP = {
  pending:    { label: 'Đang xử lý',   cls: 'badge-processing', tab: 'processing' },
  confirmed:  { label: 'Đang xử lý',   cls: 'badge-processing', tab: 'processing' },
  processing: { label: 'Đang giao hàng', cls: 'badge-shipping',  tab: 'shipping' },
  delivered:  { label: 'Đã giao hàng', cls: 'badge-delivered',  tab: 'delivered' },
  cancelled:  { label: 'Đã hủy',       cls: 'badge-cancelled',  tab: 'cancelled' },
};

const PAGE_SIZE = 5;
const DATE_OPTIONS = [
  { label: '30 ngày qua', days: 30 },
  { label: '60 ngày qua', days: 60 },
  { label: '90 ngày qua', days: 90 },
  { label: 'Tất cả',      days: 0  },
];

function formatDate(ts) {
  if (!ts) return '';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return `${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('all');
  const [search, setSearch]   = useState('');
  const [dateIdx, setDateIdx] = useState(0);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [page, setPage]       = useState(1);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getOrdersByUser(user.uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const filtered = useMemo(() => {
    let result = orders;
    // Tab filter
    if (tab !== 'all') {
      result = result.filter(o => STATUS_MAP[o.status]?.tab === tab);
    }
    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        (o.items || []).some(i => (i.title || '').toLowerCase().includes(q))
      );
    }
    // Date range
    const days = DATE_OPTIONS[dateIdx].days;
    if (days > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter(o => {
        const d = o.createdAt?.toDate ? o.createdAt.toDate() : null;
        return d && d >= cutoff;
      });
    }
    return result;
  }, [orders, tab, search, dateIdx]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleTabChange(key) {
    setTab(key);
    setPage(1);
  }

  if (loading) return (
    <div className="mop-loading">
      <div className="mop-spinner" />
      <p>Đang tải đơn hàng...</p>
    </div>
  );

  return (
    <div className="mop-page">
      <div className="mop-container">
        {/* Header */}
        <div className="mop-header">
          <h1 className="mop-title">Lịch sử mua hàng</h1>
          <p className="mop-subtitle">Quản lý và theo dõi các đơn hàng bạn đã đặt.</p>
        </div>

        {/* Toolbar */}
        <div className="mop-toolbar">
          {/* Tabs */}
          <div className="mop-tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`mop-tab${tab === t.key ? ' active' : ''}`}
                onClick={() => handleTabChange(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search + Date */}
          <div className="mop-filters">
            <div className="mop-search-wrap">
              <Search size={15} className="mop-search-icon" />
              <input
                className="mop-search"
                placeholder="Tìm kiếm mã đơn hàng..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="mop-date-wrap">
              <button className="mop-date-btn" onClick={() => setShowDateMenu(v => !v)}>
                <Calendar size={14} /> {DATE_OPTIONS[dateIdx].label}
              </button>
              {showDateMenu && (
                <div className="mop-date-dropdown">
                  {DATE_OPTIONS.map((opt, i) => (
                    <button
                      key={i}
                      className={`mop-date-item${dateIdx === i ? ' active' : ''}`}
                      onClick={() => { setDateIdx(i); setShowDateMenu(false); setPage(1); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order list */}
        {paginated.length === 0 ? (
          <div className="mop-empty">
            <ShoppingBag size={48} className="mop-empty-icon" />
            <p>Không có đơn hàng nào</p>
            <Link to="/products" className="mop-empty-btn">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="mop-list">
            {paginated.map(order => {
              const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
              const firstItem = order.items?.[0];
              return (
                <div key={order.id} className="mop-card">
                  <div className="mop-card-head">
                    <div className="mop-card-id">
                      <span className="mop-order-id">#{order.id.slice(0, 12).toUpperCase()}</span>
                      <span className={`mop-badge ${st.cls}`}>{st.label}</span>
                    </div>
                    <div className="mop-card-total">
                      <span className="mop-total-label">Tổng tiền</span>
                      <span className="mop-total-val">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                  <p className="mop-card-date">Ngày đặt: {formatDate(order.createdAt)}</p>

                  {/* Sản phẩm */}
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="mop-item-row">
                      <img
                        src={item.image || '/images/products/placeholder.jpg'}
                        alt={item.title}
                        className="mop-item-img"
                        onError={e => { e.target.src = '/images/brand/logo.svg'; }}
                      />
                      <div className="mop-item-info">
                        <p className="mop-item-name">{item.title}</p>
                        {item.qty > 1 && <p className="mop-item-qty">x{item.qty}</p>}
                        <p className="mop-item-price">{formatCurrency(item.price)}</p>
                      </div>
                      {idx === 0 && (
                        <div className="mop-item-actions">
                          {order.status === 'delivered' && (
                            <Link
                              to="/cart"
                              state={{ rebuy: order.items }}
                              className="mop-action-btn mop-rebuy"
                            >
                              Mua lại
                            </Link>
                          )}
                          {order.status === 'processing' && (
                            <span className="mop-action-btn mop-track">Theo dõi đơn</span>
                          )}
                          <Link
                            to={`/orders/${order.id}`}
                            className="mop-action-btn mop-detail"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mop-pagination">
            <button
              className="mop-page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`mop-page-btn${page === p ? ' active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="mop-page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
