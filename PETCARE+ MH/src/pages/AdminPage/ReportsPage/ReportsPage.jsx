import { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, ShoppingBag, BarChart2, Calendar, ChevronDown, Download } from 'lucide-react';
import { getOrders } from '../../../services/orderService';
import { formatCurrency } from '../../../utils/formatCurrency';
import '../AdminLayout.css';
import './ReportsPage.css';

const PIE_COLORS = ['#ffc400', '#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

const MONTHS = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
];

function buildMonthlyRevenue(orders) {
  const map = {};
  orders.forEach(o => {
    if (o.status === 'cancelled') return;
    const date = o.createdAt?.toDate ? o.createdAt.toDate() : new Date();
    const key  = `${date.getMonth() + 1}/${date.getFullYear()}`;
    map[key]   = (map[key] || 0) + (o.total || 0);
  });
  return Object.entries(map)
    .slice(-8)
    .map(([name, revenue]) => ({ name, revenue }));
}

function buildCategoryRevenue(orders) {
  const map = {};
  orders.forEach(o => {
    if (o.status === 'cancelled') return;
    (o.items || []).forEach(item => {
      const cat = item.category || 'Khác';
      map[cat]  = (map[cat] || 0) + (item.price || 0) * (item.qty || 1);
    });
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function buildTopProducts(orders) {
  const map = {};
  orders.forEach(o => {
    if (o.status === 'cancelled') return;
    (o.items || []).forEach(item => {
      if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0 };
      map[item.name].qty     += item.qty || 1;
      map[item.name].revenue += (item.price || 0) * (item.qty || 1);
    });
  });
  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

export default function ReportsPage() {
  const now = new Date();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear]   = useState(now.getFullYear());
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    getOrders(500).then(setOrders).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  if (loading) return <p className="admin-loading">Đang tải...</p>;

  const filteredOrders = orders.filter(o => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || 0);
    return d.getMonth() === selMonth && d.getFullYear() === selYear;
  });

  const completed    = filteredOrders.filter(o => o.status !== 'cancelled');
  const totalRevenue = completed.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder     = completed.length ? totalRevenue / completed.length : 0;
  const newThisMonth = filteredOrders.length;

  const monthlyData  = buildMonthlyRevenue(orders);
  const categoryData = buildCategoryRevenue(filteredOrders);
  const topProducts  = buildTopProducts(filteredOrders);

  const years = [...new Set(orders.map(o => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || 0);
    return d.getFullYear();
  }))].sort((a, b) => b - a);
  if (!years.includes(selYear)) years.push(selYear);

  const handleExport = () => {
    const header = ['Mã đơn', 'Khách hàng', 'Email', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'];
    const rows = filteredOrders.map(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date();
      return [o.id, o.fullName || '', o.userEmail || '', o.total || 0, o.status || '', d.toLocaleDateString('vi-VN')];
    });
    const summary = [
      [`Báo cáo tháng ${selMonth + 1}/${selYear}`],
      [`Tổng doanh thu: ${formatCurrency(totalRevenue)}`],
      [`Số đơn hàng: ${filteredOrders.length}`],
      [`Giá trị TB đơn: ${formatCurrency(avgOrder)}`],
      [],
      header,
      ...rows,
    ];
    const csv = summary.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-thang-${selMonth + 1}-${selYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Báo cáo &amp; Analytics</h1>
          <p>Theo dõi hiệu suất kinh doanh và xu hướng bán hàng.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }} ref={pickerRef}>
          <button className="btn-outline-admin" onClick={() => setShowPicker(v => !v)}>
            <Calendar size={15} /> Tháng {selMonth + 1}/{selYear} <ChevronDown size={13} style={{ marginLeft: 4 }} />
          </button>
          {showPicker && (
            <div className="rp-month-picker">
              <div className="rp-mp-years">
                {years.map(y => (
                  <button key={y} className={`rp-mp-yr${y === selYear ? ' active' : ''}`} onClick={() => setSelYear(y)}>{y}</button>
                ))}
              </div>
              <div className="rp-mp-months">
                {MONTHS.map((m, i) => (
                  <button key={i} className={`rp-mp-mo${i === selMonth ? ' active' : ''}`}
                    onClick={() => { setSelMonth(i); setShowPicker(false); }}>{m}</button>
                ))}
              </div>
            </div>
          )}
          <button className="btn-primary-admin" onClick={handleExport}><Download size={15} /> Xuất báo cáo</button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon--green"><TrendingUp size={20} /></div>
          <div>
            <p className="stat-label">Tổng doanh thu</p>
            <p className="stat-value">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon--blue"><ShoppingBag size={20} /></div>
          <div>
            <p className="stat-label">Đơn hàng mới tháng này</p>
            <p className="stat-value">{newThisMonth}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon stat-icon--orange"><BarChart2 size={20} /></div>
          <div>
            <p className="stat-label">Giá trị TB đơn</p>
            <p className="stat-value">{formatCurrency(avgOrder)}</p>
          </div>
        </div>
      </div>

      <div className="reports-charts-row">
        <div className="reports-chart-card">
          <h3>Doanh thu theo thời gian</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#ffc400" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="reports-chart-card">
          <h3>Tỷ trọng doanh thu theo danh mục</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label={({ name }) => name}>
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 24 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <strong>Sản phẩm bán chạy nhất</strong>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng bán</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>Chưa có dữ liệu</td></tr>
            )}
            {topProducts.map((p, i) => (
              <tr key={p.name}>
                <td>{i + 1}</td>
                <td><strong>{p.name}</strong></td>
                <td>{p.qty.toLocaleString()}</td>
                <td><strong>{formatCurrency(p.revenue)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
