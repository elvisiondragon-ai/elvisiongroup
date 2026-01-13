import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar, Filter, Download, Search } from 'lucide-react';

const ReportSales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const allowedEmails = ['elvisiondragon@gmail.com', 'dragon@yahoo.com', 'elreyzandra@gmail.com'];
      
      if (!user || !user.email || !allowedEmails.includes(user.email)) {
        navigate('/');
        return;
      }
      
      fetchSales();
    } catch (error) {
      console.error('Error checking access:', error);
      navigate('/');
    }
  };

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('global_product')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSales = () => {
    let filtered = [...sales];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        return saleDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(sale => new Date(sale.created_at) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(sale => new Date(sale.created_at) >= monthAgo);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredSales = filterSales();

  // Calculate metrics
  const totalRevenue = filteredSales
    .filter(s => s.status === 'PAID')
    .reduce((sum, sale) => sum + (sale.amount || 0), 0);

  const paidCount = filteredSales.filter(s => s.status === 'PAID').length;
  const unpaidCount = filteredSales.filter(s => s.status === 'UNPAID' || s.status === 'pending').length;
  const totalOrders = filteredSales.length;

  // Chart data - Revenue by day
  const revenueByDay = filteredSales
    .filter(s => s.status === 'PAID')
    .reduce((acc, sale) => {
      const date = new Date(sale.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0 };
      }
      acc[date].revenue += sale.amount || 0;
      acc[date].orders += 1;
      return acc;
    }, {});

  const revenueChartData = Object.values(revenueByDay).slice(-7);

  // Status distribution
  const statusData = [
    { name: 'PAID', value: paidCount, color: '#10b981' },
    { name: 'UNPAID', value: unpaidCount, color: '#f59e0b' }
  ];

  // Top products
  const productStats = filteredSales
    .filter(s => s.status === 'PAID')
    .reduce((acc, sale) => {
      const product = sale.product_name || 'Unknown';
      if (!acc[product]) {
        acc[product] = { product, revenue: 0, count: 0 };
      }
      acc[product].revenue += sale.amount || 0;
      acc[product].count += 1;
      return acc;
    }, {});

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sales Dashboard eL Vision Ecosystem</h1>
          <p className="text-purple-300">Track your sales performance in real-time</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search by name, email, product..."
                className="bg-transparent border-none outline-none text-white placeholder-purple-300 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-300" />
              <select
                className="bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20 outline-none cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-300" />
              <select
                className="bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20 outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-emerald-300 text-sm">Total revenue from paid orders</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-10 h-10 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">Orders</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalOrders}</div>
            <div className="text-blue-300 text-sm">Total orders placed</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">Paid</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{paidCount}</div>
            <div className="text-purple-300 text-sm">Successfully paid orders</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold">Unpaid</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{unpaidCount}</div>
            <div className="text-orange-300 text-sm">Pending payment orders</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Revenue Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff80" />
                <YAxis 
                  stroke="#ffffff80"
                  width={80}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value;
                  }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Revenue']}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="product" stroke="#ffffff80" />
              <YAxis 
                stroke="#ffffff80"
                width={80}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value;
                }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Revenue']}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
            <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Customer</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Product</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Email</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Phone</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Amount</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Status</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{sale.name || '-'}</td>
                    <td className="py-3 px-4 text-white">{sale.product_name || '-'}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{sale.email || '-'}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{sale.phone || '-'}</td>
                    <td className="py-3 px-4 text-white font-semibold">
                      Rp {(sale.amount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sale.status === 'PAID' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-300 text-sm">
                      {new Date(sale.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSales.length === 0 && (
              <div className="text-center py-8 text-purple-300">
                No sales data found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSales;