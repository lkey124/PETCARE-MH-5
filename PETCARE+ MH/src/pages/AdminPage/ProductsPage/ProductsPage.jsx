import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, LayoutList, LayoutGrid, ChevronDown } from "lucide-react";
import { getProducts, deleteProduct } from "../../../services/productService";
import { Toast } from "../../../components/common/Toast/Toast";
import { formatCurrency } from "../../../utils/formatCurrency";
import "../AdminLayout.css";
import "./ProductsPage.css";

const CAT_COLORS = {
  'Ch\u0103m s\u00f3c l\u00f4ng': { bg: '#fef9c3', color: '#a16207' },
  'M\u00e1y l\u1ecdc n\u01b0\u1edbc':   { bg: '#eff6ff', color: '#1d4ed8' },
  'M\u00e1y cho \u0103n':    { bg: '#f0fdf4', color: '#15803d' },
  'M\u00e1y v\u1ec7 sinh':    { bg: '#fdf4ff', color: '#7e22ce' },
  'Ph\u1ee5 ki\u1ec7n':       { bg: '#fff7ed', color: '#c2410c' },
  'Th\u1ee9c \u0103n':        { bg: '#fef2f2', color: '#dc2626' },
};
const getCatStyle = cat => CAT_COLORS[cat] || { bg: '#f1f5f9', color: '#475569' };

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [deleting, setDeleting]   = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast]         = useState({ msg: "", type: "success", key: 0 });
  const [view, setView]           = useState("list");
  const [page, setPage]           = useState(1);
  const PAGE_SIZE = 10;

  const showToast = (msg, type = "success") =>
    setToast(t => ({ msg, type, key: t.key + 1 }));

  useEffect(() => {
    getProducts()
      .then(data => { setProducts(data); setFiltered(data); })
      .catch(() => showToast("Không tải được sản phẩm", "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = products;
    if (catFilter !== "all") r = r.filter(p => p.category === catFilter);
    if (search) r = r.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(r);
    setPage(1);
  }, [search, catFilter, products]);

  const categories = [...new Set(products.map(p => p.category))].sort();

  const openAdd  = () => navigate("/admin/products/new");
  const openEdit = (p) => navigate(`/admin/products/edit/${p.id}`);

  const handleDelete = async id => {
    setConfirmDelete(id);
  };

  const doDelete = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Đã xóa sản phẩm");
    } catch {
      showToast("Xóa thất bại, thử lại sau", "error");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <p className="admin-loading">Đang tải...</p>;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNums   = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 2), Math.min(totalPages, page + 1)
  );

  return (
    <div>
      <Toast key={toast.key} message={toast.msg} type={toast.type} visible={true} />

      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Xóa sản phẩm?</h3>
            <p>Thao tác này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn.</p>
            <div className="confirm-actions">
              <button className="btn-cancel-admin" onClick={() => setConfirmDelete(null)}>Hủy</button>
              <button className="btn-danger-admin" onClick={doDelete}>Xác nhận xóa</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1>Quản lý Sản phẩm</h1>
          <p>Xem, thêm, sửa và quản lý kho hàng của bạn.</p>
        </div>
        <button className="btn-primary-admin" onClick={openAdd}>
          <Plus size={15} /> Thêm sản phẩm
        </button>
      </div>

      <div className="products-toolbar-card">
        <div className="search-box products-search">
          <Search size={15} className="search-box__icon" />
          <input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-pill">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="all">Tất cả danh mục</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} />
        </div>
        <div style={{ flex: 1 }} />
        <div className="view-toggle">
          <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}><LayoutList size={16} /></button>
          <button className={`view-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')}><LayoutGrid size={16} /></button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 72 }}>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th style={{ width: 90 }}>Tồn kho</th>
              <th>Trạng thái</th>
              <th style={{ width: 90 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => {
              const catStyle = getCatStyle(p.category);
              const stock = p.stock ?? null;
              const sku = p.id ? `SKU-${String(p.id).slice(0,8).toUpperCase()}` : null;
              return (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image} alt={p.title}
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, background: "#f5f5f5" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{p.title}</div>
                    {sku && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{sku}</div>}
                  </td>
                  <td>
                    <span className="cat-pill" style={{ background: catStyle.bg, color: catStyle.color }}>
                      {p.category}
                    </span>
                  </td>
                  <td><strong>{formatCurrency(p.price)}</strong></td>
                  <td style={{ fontWeight: 600, color: stock === 0 ? '#dc2626' : stock !== null && stock <= 5 ? '#d97706' : '#1a1a1a' }}>
                    {stock === null ? '—' : stock}
                    {stock !== null && stock > 0 && stock <= 5 && (
                      <span style={{ display: 'block', fontSize: 11, color: '#d97706', fontWeight: 600 }}>Sắp hết!</span>
                    )}
                  </td>
                  <td>
                    <span className={"badge " + ((p.inStock === false || (p.stock !== null && p.stock <= 0)) ? "badge--outstock" : "badge--instock")}>
                      {(p.inStock === false || (p.stock !== null && p.stock <= 0)) ? "Hết hàng" : "Còn hàng"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn action-btn--edit" onClick={() => openEdit(p)}>
                        <Pencil size={14} />
                      </button>
                      <button
                        className="action-btn action-btn--del"
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-state">Không có sản phẩm nào</p>}
        <div className="admin-pagination">
          <span>Hiển thị {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} của {filtered.length} sản phẩm</span>
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