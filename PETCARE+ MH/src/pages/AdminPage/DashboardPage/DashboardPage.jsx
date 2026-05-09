import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { getOrderStats, getOrders } from '../../../services/orderService';
import { formatCurrency } from '../../../utils/formatCurrency';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats]   = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          getOrderStats(),
          getOrders(20),
        ]);
        setStats(statsData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Lỗi tải dữ liệu dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  const totalOrders  = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayStr     = `${new Date().getDate()}/${new Date().getMonth() + 1}`;
  const todayOrders  = stats.find((s) => s.date === todayStr)?.orders ?? 0;

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="stat-card">
          <p className="stat-card__label">Tổng đơn hàng</p>
          <p className="stat-card__value">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Tổng doanh thu</p>
          <p className="stat-card__value">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Đơn hàng hôm nay</p>
          <p className="stat-card__value">{todayOrders}</p>
        </div>
      </div>

      <div className="dashboard-chart">
        <h2>Số lượng đơn hàng theo ngày</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) =>
                name === 'revenue' ? formatCurrency(value) : value
              }
            />
            <Bar dataKey="orders"  name="Đơn hàng"  fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" name="Doanh thu"  fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
