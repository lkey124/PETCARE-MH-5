import { useEffect, useState } from 'react';
import { Search, Download, Plus, SlidersHorizontal, Eye, Pencil, Trash2, X, RefreshCw } from 'lucide-react';
import { getUsers, addUser, updateUser, deleteUser } from '../../../services/userService';
import { getOrders } from '../../../services/orderService';
import { Toast } from '../../../components/common/Toast/Toast';
import { formatCurrency } from '../../../utils/formatCurrency';
import '../AdminLayout.css';

const TABS = ['Tất cả', 'Thân thiết', 'Khách hàng mới'];
const PAGE_SIZE = 10;
const EMPTY_FORM = { fullName: '', email: '', phone: '', role: 1 };
// So don hang toi thieu de duoc phan loai khach hang than thiet
const LOYAL_THRESHOLD = 3;

function classifyUser(u) {
  if ((u.orderCount ?? 0) >= LOYAL_THRESHOLD) return { label: 'Thân thiết',   cls: 'badge--loyal' };
  if ((u.orderCount ?? 0) > 0)               return { label: 'Đã mua hàng', cls: 'badge--regular' };
  return { label: 'Mới', cls: '' };
}

export default function CustomersPage() {
  const [users, setUsers]       = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState('Tất cả');
  const [page, setPage]         = useState(1);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [syncing, setSyncing]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast]       = useState({ msg: '', type: 'success', key: 0 });

  const showToast = (msg, type = 'success') => setToast(t => ({ msg, type, key: t.key + 1 }));

  useEffect(() => {
    Promise.all([getUsers(200), getOrders(1000)]).then(([userData, orderData]) => {
      const customers = userData.filter(u => u.role !== 0);
      // Tinh orderCount va totalSpent tu don hang thuc te
      const statsMap = {};
      orderData.filter(o => o.status !== 'cancelled').forEach(o => {
        const key = o.userId || o.userEmail;
        if (!key) return;
        if (!statsMap[key]) statsMap[key] = { orderCount: 0, totalSpent: 0 };
        statsMap[key].orderCount++;
        statsMap[key].totalSpent += o.total || 0;
      });
      const enriched = customers.map(u => {
        const s = statsMap[u.id] || statsMap[u.email] || { orderCount: 0, totalSpent: 0 };
        return { ...u, orderCount: s.orderCount, totalSpent: s.totalSpent || u.totalSpent || null };
      });
      setUsers(enriched);
      setFiltered(enriched);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = users;
    if (tab === 'Thân thiết')     r = r.filter(u => (u.orderCount ?? 0) >= LOYAL_THRESHOLD);
    if (tab === 'Khách hàng mới') r = r.filter(u => (u.orderCount ?? 0) < LOYAL_THRESHOLD);
    if (search) r = r.filter(u =>
      (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search)
    );
    setFiltered(r);
    setPage(1);
  }, [search, tab, users]);

  const openAdd  = () => { setForm(EMPTY_FORM); setModal({ mode: 'add' }); };
  const openEdit = u  => { setForm({ fullName: u.fullName || '', email: u.email || '', phone: u.phone || '', role: u.role ?? 1 }); setModal({ mode: 'edit', user: u }); };
  const openView = u  => setModal({ mode: 'view', user: u });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal.mode === 'add') {
        const id = await addUser(form);
        setUsers(prev => [{ id, ...form, createdAt: null }, ...prev]);
      } else {
        await updateUser(modal.user.id, form);
        setUsers(prev => prev.map(u => u.id === modal.user.id ? { ...u, ...form } : u));
      }
      setModal(null);
    } finally { setSaving(false); }
  };

  const handleExport = () => {
    const header = ['Họ tên', 'Email', 'Số điện thoại', 'Phân loại', 'Đơn hàng', 'Tổng chi tiêu', 'Ngày tham gia'];
    const rows = filtered.map(u => {
      const cls = classifyUser(u);
      const joinDate = u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('vi-VN') : '';
      return [
        u.fullName || '',
        u.email || '',
        u.phone || '',
        cls.label,
        u.orderCount ?? 0,
        u.totalSpent ?? '',
        joinDate,
      ];
    });
    const csv = [header, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khach-hang-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSyncRoles = async () => {
    const toUpgrade = users.filter(u => (u.orderCount ?? 0) >= LOYAL_THRESHOLD && u.role !== 2);
    if (toUpgrade.length === 0) { showToast('Không có khách hàng nào cần cập nhật'); return; }
    setSyncing(true);
    try {
      await Promise.all(toUpgrade.map(u => updateUser(u.id, { fullName: u.fullName || '', phone: u.phone || '', role: 2 })));
      setUsers(prev => prev.map(u => toUpgrade.find(t => t.id === u.id) ? { ...u, role: 2 } : u));
      showToast(`Đã nâng cấp ${toUpgrade.length} khách hàng thân thiết`);
    } catch { showToast('Có lỗi khi cập nhật phân loại', 'error'); }
    finally { setSyncing(false); }
  };

  const handleDelete = async () => {
    await deleteUser(deleteId);
    setUsers(prev => prev.filter(u => u.id !== deleteId));
    setDeleteId(null);
  };

  if (loading) return <p className="admin-loading">Đang tải...</p>;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNums   = Array.from({ length: totalPages }, (_, i) => i + 1)
    .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1));

  return (
    <div>
      <Toast key={toast.key} message={toast.msg} type={toast.type} visible={true} />
      {deleteId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Xóa khách hàng?</h3>
            <p>Thao tác này không thể hoàn tác. Dữ liệu khách hàng sẽ bị xóa vĩnh viễn.</p>
            <div className="confirm-actions">
              <button className="btn-cancel-admin" onClick={() => setDeleteId(null)}>Hủy</button>
              <button className="btn-danger-admin" onClick={handleDelete}>Xác nhận xóa</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modal.mode === 'add'  ? 'Thêm Khách hàng' :
                 modal.mode === 'edit' ? 'Chỉnh sửa Khách hàng' : 'Chi tiết Khách hàng'}
              </h2>
              <button className="modal-close" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {modal.mode === 'view' ? (
                <ViewDetail
                  user={modal.user}
                  onEdit={() => openEdit(modal.user)}
                  onDelete={() => { setDeleteId(modal.user.id); setModal(null); }}
                />
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Họ và tên *</label>
                      <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Nguyễn Văn A" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" disabled={modal.mode === 'edit'} />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0901234567" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phân loại</label>
                      <select value={form.role} onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) }))}>
                        <option value={1}>Khách hàng</option>
                        <option value={2}>Thân thiết</option>
                        <option value={0}>Admin</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            {modal.mode !== 'view' && (
              <div className="modal-footer">
                <button className="btn-cancel-admin" onClick={() => setModal(null)}>Hủy</button>
                <button className="btn-save-admin" onClick={handleSave} disabled={saving || !form.fullName || !form.email}>
                  {saving ? 'Đang lưu...' : modal.mode === 'add' ? 'Thêm khách hàng' : 'Lưu thay đổi'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1>Quản lý Khách hàng</h1>
          <p>Xem, phân loại và quản lý thông tin khách hàng của hệ thống.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline-admin" onClick={handleSyncRoles} disabled={syncing}
            title={`Tự động nâng cấp khách hàng có ≥ ${LOYAL_THRESHOLD} đơn thành Thân thiết`}>
            <RefreshCw size={14} /> {syncing ? 'Đang đồng bộ...' : 'Đồng bộ phân loại'}
          </button>
          <button className="btn-outline-admin" onClick={handleExport}><Download size={15} /> Xuất dữ liệu</button>
          <button className="btn-primary-admin" onClick={openAdd}><Plus size={15} /> Thêm Khách hàng</button>
        </div>
      </div>

      <div className="customers-toolbar">
        <div className="search-box" style={{ width: 280, flex: 'none' }}>
          <Search size={15} className="search-box__icon" />
          <input placeholder="Tìm kiếm theo tên, email, sđt..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="cust-tabs">
          {TABS.map(t => (
            <button key={t} className={`cust-tab${tab === t ? ' cust-tab--active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn-outline-admin" style={{ background: 'transparent', border: 'none', color: '#374151' }}>
          <SlidersHorizontal size={14} /> Bộ lọc nâng cao
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Tổng chi tiêu</th>
              <th>Đơn hàng</th>
              <th>Phân loại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(user => {
              const joinDate   = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('vi-VN') : '—';
              const cls        = classifyUser(user);
              const initials   = (user.fullName?.[0] || user.email?.[0] || '?').toUpperCase();
              const orderCount = user.orderCount ?? 0;
              const totalSpent = user.totalSpent ?? null;
              return (
                <tr key={user.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">{initials}</div>
                      <div>
                        <div className="customer-name">{user.fullName || '—'}</div>
                        <div className="customer-email">Tham gia: {joinDate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="customer-name">{user.email}</div>
                    <div className="customer-email">{user.phone || '—'}</div>
                  </td>
                  <td><strong>{totalSpent !== null ? formatCurrency(totalSpent) : '—'}</strong></td>
                  <td><span className="order-count-badge">{orderCount}</span></td>
                  <td>
                    {cls.cls
                      ? <span className={`badge ${cls.cls}`}>{cls.label}</span>
                      : <span style={{ fontSize: 13, color: '#64748b' }}>{cls.label}</span>
                    }
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn action-btn--icon" title="Xem" onClick={() => openView(user)}><Eye size={16} /></button>
                      <button className="action-btn action-btn--icon action-btn--edit" title="Sửa" onClick={() => openEdit(user)}><Pencil size={15} /></button>
                      <button className="action-btn action-btn--icon action-btn--del" title="Xóa" onClick={() => setDeleteId(user.id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-state">Không có khách hàng nào</p>}
        <div className="admin-pagination">
          <span>Hiển thị {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} trong số {filtered.length} khách hàng</span>
          {totalPages > 1 && (
            <div className="pagination-btns">
              <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>&lt;</button>
              {page > 3 && <><button className="page-btn" onClick={() => setPage(1)}>1</button><span style={{padding:'0 4px',color:'#94a3b8'}}>...</span></>}
              {pageNums.map(n => (
                <button key={n} className={`page-btn${page===n?' active':''}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              {page < totalPages - 2 && <><span style={{padding:'0 4px',color:'#94a3b8'}}>...</span><button className="page-btn" onClick={() => setPage(totalPages)}>{totalPages}</button></>}
              <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>&gt;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ViewDetail({ user, onEdit, onDelete }) {
  const joinDate = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('vi-VN') : '—';
  const cls = (() => {
    if (user.role === 2)     return { label: 'Thân thiết',   cls: 'badge--loyal' };
    if (user.orderCount > 5) return { label: 'Thường xuyên', cls: 'badge--regular' };
    return { label: 'Mới', cls: '' };
  })();
  const initials = (user.fullName?.[0] || user.email?.[0] || '?').toUpperCase();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div className="customer-avatar" style={{ width: 52, height: 52, fontSize: 20 }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{user.fullName || '—'}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>Tham gia: {joinDate}</div>
        </div>
        {cls.cls
          ? <span className={`badge ${cls.cls}`} style={{ marginLeft: 'auto' }}>{cls.label}</span>
          : <span style={{ marginLeft: 'auto', fontSize: 13, color: '#64748b' }}>{cls.label}</span>
        }
      </div>
      {[['Email', user.email], ['Số điện thoại', user.phone || '—'], ['Đơn hàng', user.orderCount ?? 0], ['Tổng chi tiêu', user.totalSpent ? formatCurrency(user.totalSpent) : '—']].map(([l, v]) => (
        <div className="modal-detail-row" key={l}>
          <span className="modal-detail-label">{l}</span>
          <span className="modal-detail-value">{v}</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button className="btn-danger-admin" onClick={onDelete}>Xóa khách hàng</button>
        <button className="btn-save-admin" style={{ marginLeft: 'auto' }} onClick={onEdit}>Chỉnh sửa</button>
      </div>
    </div>
  );
}
