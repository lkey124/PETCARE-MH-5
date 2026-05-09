import { useEffect, useState } from 'react';
import { Eye, Pencil, Search, Download, Package, Clock, CheckCircle2, Calendar, ChevronDown, Trash2, X } from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder } from '../../../services/orderService';
import { formatCurrency } from '../../../utils/formatCurrency';
import '../AdminLayout.css';

const STATUS_CONFIG = {
  pending:    { label: 'Chờ xử lý',   cls: 'badge--pending' },
  confirmed:  { label: 'Đã xác nhận', cls: 'badge--confirmed' },
  processing: { label: 'Đang giao',   cls: 'badge--processing' },
  delivered:  { label: 'Đã giao',     cls: 'badge--delivered' },
  cancelled:  { label: 'Đã hủy',      cls: 'badge--cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [page, setPage]         = useState(1);
  const [viewOrder, setViewOrder] = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const PAGE_SIZE = 10;

  useEffect(() => {
    getOrders(200).then(data => {
      setOrders(data);
      setFiltered(data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    if (search) result = result.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.fullName || '').toLowerCase().includes(search.toLowerCase())
    );
    if (dateFrom) result = result.filter(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : null;
      return d && d >= new Date(dateFrom);
    });
    if (dateTo) result = result.filter(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : null;
      return d && d <= new Date(dateTo + 'T23:59:59');
    });
    setFiltered(result);
    setPage(1);
  }, [search, statusFilter, dateFrom, dateTo, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (viewOrder?.id === orderId) setViewOrder(v => ({ ...v, status: newStatus }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteOrder(deleteId);
    setOrders(prev => prev.filter(o => o.id !== deleteId));
    setDeleteId(null);
    if (viewOrder?.id === deleteId) setViewOrder(null);
  };

  const pending   = orders.filter(o => o.status === 'pending').length;
  const delivered = orders.filter(o => o.status === 'delivered').length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNums   = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 2), Math.min(totalPages, page + 1)
  );

  if (loading) return <p className="admin-loading">Đang tải...</p>;

  return (
    <div>
      {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
      {deleteId && <ConfirmDeleteOrder onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />}
      <div className="admin-page-header">
        <div>
          <h1>Quản lý Đơn hàng</h1>
          <p>Theo dõi và xử lý các đơn hàng gần đây của bạn.</p>
        </div>
        <button className="btn-export"><Download size={15} /> Xuất báo cáo</button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon--gray"><Package size={20} /></div>
          <div><p className="stat-label">Tổng đơn hàng</p><p className="stat-value">{orders.length.toLocaleString()}</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon--orange"><Clock size={20} /></div>
          <div><p className="stat-label">Đang xử lý</p><p className="stat-value">{pending}</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon--green"><CheckCircle2 size={20} /></div>
          <div><p className="stat-label">Đã hoàn thành</p><p className="stat-value">{delivered}</p></div>
        </div>
      </div>

      <div className="orders-toolbar-card">
        <div className="search-box">
          <Search size={15} className="search-box__icon" />
          <input placeholder="Tìm kiếm Mã đơn hàng..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-pill">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả Trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <ChevronDown size={14} />
        </div>
        <div className="date-range">
          <Calendar size={15} className="date-range__icon" />
          <input type="date" className="date-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span style={{ color: '#94a3b8' }}>-</span>
          <input type="date" className="date-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(order => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const date = order.createdAt?.toDate
                ? order.createdAt.toDate().toLocaleDateString('vi-VN')
                : '—';
              const firstItem = order.items?.[0];
              return (
                <tr key={order.id}>
                  <td><a className="order-id-link" href="#">#ORD-{order.id.slice(0,6).toUpperCase()}</a></td>
                  <td>
                    <div className="customer-name">{order.fullName || '—'}</div>
                    <div className="customer-email">{order.userEmail}</div>
                  </td>
                  <td>
                    <div className="customer-cell">
                      {firstItem?.image && (
                        <img src={firstItem.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#f5f5f5', flexShrink: 0 }}
                          onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2px' }}>{firstItem?.name || '—'}</span>
                    </div>
                  </td>
                  <td><strong>{formatCurrency(order.total)}</strong></td>
                  <td>{date}</td>
                  <td><span className={`badge ${status.cls}`}>{status.label}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn action-btn--icon" title="Xem chi tiết" onClick={() => setViewOrder(order)}><Eye size={16} /></button>
                      <button className="action-btn action-btn--icon action-btn--del" title="Xóa" onClick={() => setDeleteId(order.id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-state">Không có đơn hàng nào</p>}
        <div className="admin-pagination">
          <span>Hiển thị {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} trong {filtered.length} đơn hàng</span>
          {totalPages > 1 && (
            <div className="pagination-btns">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</button>
              {page > 3 && <><button className="page-btn" onClick={() => setPage(1)}>1</button><span style={{padding:'0 4px',color:'#94a3b8'}}>...</span></>}
              {pageNums.map(n => (
                <button key={n} className={`page-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              {page < totalPages - 2 && <><span style={{padding:'0 4px',color:'#94a3b8'}}>...</span><button className="page-btn" onClick={() => setPage(totalPages)}>{totalPages}</button></>}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>&gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function OrderDetailModal({ order, onClose }) {
    const [localStatus, setLocalStatus] = useState(order.status);
    const [saving, setSaving] = useState(false);
    const date = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('vi-VN') : '—';
    const statusCfg = STATUS_CONFIG[localStatus] || STATUS_CONFIG.pending;
    const handleSaveStatus = async () => {
      if (localStatus === order.status) return;
      setSaving(true);
      await handleStatusChange(order.id, localStatus);
      setSaving(false);
    };
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box modal-box--lg" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>#ORD-{order.id.slice(0,6).toUpperCase()}</h2>
            <button className="modal-close" onClick={onClose}><X size={18} /></button>
          </div>
          <div className="modal-body">
            <div className="modal-section">
              <h3>Thông tin khách hàng</h3>
              {[['Họ tên', order.fullName], ['Email', order.userEmail], ['SĐT', order.phone], ['Cố địa', order.address], ['Thanh toán', order.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : order.paymentMethod]].map(([l, v]) => v ? (
                <div className="modal-detail-row" key={l}>
                  <span className="modal-detail-label">{l}</span>
                  <span className="modal-detail-value">{v}</span>
                </div>
              ) : null)}
            </div>
            <div className="modal-section">
              <h3>Sản phẩm ({order.items?.length || 0})</h3>
              <div className="order-items-list">
                {(order.items || []).map((item, i) => (
                  <div className="order-item-row" key={i}>
                    {item.image && <img className="order-item-img" src={item.image} alt="" onError={e => e.target.style.display='none'} />}
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">x{item.qty || 1}</span>
                    <span className="order-item-price">{formatCurrency((item.price || 0) * (item.qty || 1))}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-detail-row">
              <span className="modal-detail-label">Tổng tiền</span>
              <strong style={{ fontSize: 16, color: '#1a1a1a' }}>{formatCurrency(order.total)}</strong>
            </div>
            <div className="modal-detail-row">
              <span className="modal-detail-label">Ngày đặt</span>
              <span className="modal-detail-value">{date}</span>
            </div>
            <div className="modal-detail-row" style={{ alignItems: 'center' }}>
              <span className="modal-detail-label">Trạng thái</span>
              <div className="status-select-wrap">
                <select value={localStatus} onChange={e => setLocalStatus(e.target.value)}>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <span className={`badge ${STATUS_CONFIG[localStatus]?.cls}`}>{STATUS_CONFIG[localStatus]?.label}</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-danger-admin" onClick={async () => { await handleStatusChange(order.id, 'cancelled'); onClose(); }}>Hủy đơn</button>
            <button className="btn-cancel-admin" onClick={onClose}>Đóng</button>
            {localStatus !== order.status && (
              <button className="btn-save-admin" onClick={handleSaveStatus} disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu trạng thái'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function ConfirmDeleteOrder({ onCancel, onConfirm }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>Xóa đơn hàng?</h3>
        <p>Thao tác này không thể hoàn tác. Đơn hàng sẽ bị xóa vĩnh viễn.</p>
        <div className="confirm-actions">
          <button className="btn-cancel-admin" onClick={onCancel}>Hủy</button>
          <button className="btn-danger-admin" onClick={onConfirm}>Xác nhận xóa</button>
        </div>
      </div>
    </div>
  );
}
