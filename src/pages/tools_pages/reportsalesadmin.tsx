import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Banknote, ShoppingCart, Users, Calendar, Filter, Download, Search } from 'lucide-react';

// Product list based on scan
const PRODUCTS = [
  { name: 'Drelf Health Supplement', price: 349000 },
  { name: 'FitFactor Pro Program', price: 499000 },
  { name: 'HungryLater Appetite Suppressant', price: 299000 },
  { name: 'ElRoyale Parfum Signature', price: 199000 },
  { name: 'Ebook Percaya Diri', price: 100000 },
  { name: 'Webinar Burnout Recovery', price: 150000 },
  { name: 'Webinar Ibu & Anak', price: 150000 },
  { name: 'Webinar Anak Mandiri', price: 150000 },
  { name: 'Ebook Langsing Sehat', price: 125000 },
  { name: 'Ebook Feminine Energy', price: 149000 },
  { name: 'Ebook Uang Panas', price: 199000 },
  { name: 'El Royale Jewelry - Silver Edition', price: 850000 },
  { name: 'Visionary Masterclass', price: 1250000 }
];

const NAMES = [
  'Budi Santoso', 'Siti Aminah', 'Agus Prasetyo', 'Lani Wijaya', 'Dewi Lestari', 
  'Rian Hidayat', 'Maya Putri', 'Eko Susanto', 'Rina Permata', 'Andi Wijaya', 
  'Siska Putri', 'Tono Saputra', 'Yanti Kusuma', 'Dedi Irawan', 'Ani Suryani', 
  'Bambang Hermawan', 'Wati Setiawati', 'Hendra Wijaya', 'Linda Sari', 'Rudi Tabuti',
  'Slamet Rahardjo', 'Joko Widodo', 'Prabowo Subianto', 'Ganjar Pranowo', 'Anies Baswedan',
  'Siti Nurhaliza', 'Krisdayanti', 'Syahrini', 'Luna Maya', 'Raffi Ahmad',
  'Baim Wong', 'Deddy Corbuzier', 'Najwa Shihab', 'Rocky Gerung', 'Hotman Paris'
];

const TYPOS = [' ', '', '..', '123', '_', 'ayay', 'ok', 'fix', 'test', 'siap'];
const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'windowslive.com', 'ymail.com'];

const generateMockSales = () => {
  const sales = [];
  const now = new Date();
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(now.getDate() - 60);

  // Target 400,000,000 IDR
  let currentTotal = 0;
  
  for (let i = 0; i < 60; i++) {
    const currentDate = new Date(sixtyDaysAgo);
    currentDate.setDate(currentDate.getDate() + i);
    
    const dailyCount = Math.floor(Math.random() * 25) + 20; 
    
    for (let j = 0; j < dailyCount; j++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      let name = NAMES[Math.floor(Math.random() * NAMES.length)];
      
      // Add realistic "absurdity" or typos to some names
      if (Math.random() > 0.8) {
        const randomness = [' (Admin)', ' FIX', ' - LUNAS', ' - NEW', '!!!', '..'];
        name += randomness[Math.floor(Math.random() * randomness.length)];
      }
      
      if (Math.random() > 0.9) {
        name = name.toUpperCase();
      }

      // Realistic messy emails
      let emailPrefix = name.toLowerCase().split(' ')[0];
      if (Math.random() > 0.5) emailPrefix += Math.floor(Math.random() * 9999);
      if (Math.random() > 0.7) emailPrefix += TYPOS[Math.floor(Math.random() * TYPOS.length)];
      
      const email = `${emailPrefix}@${DOMAINS[Math.floor(Math.random() * DOMAINS.length)]}`;
      
      const saleTime = new Date(currentDate);
      saleTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      const status = Math.random() > 0.1 ? 'PAID' : 'UNPAID';
      const amount = product.price;

      sales.push({
        id: `mock-${i}-${j}-${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        email: email,
        product_name: product.name,
        amount: amount,
        status: status,
        created_at: saleTime.toISOString(),
        phone: '08' + Math.floor(1000000000 + Math.random() * 9000000000).toString()
      });

      if (status === 'PAID') {
        currentTotal += amount;
      }
    }
  }
  
  return sales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

const ReportSalesAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('60days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use useMemo to prevent regeneration on every render
  const allSales = useMemo(() => generateMockSales(), []);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const allowedEmails = ['elvisiondragon@gmail.com', 'dragon@yahoo.com', 'elreyzandra@gmail.com'];
        
        if (!user || !user.email || !allowedEmails.includes(user.email)) {
          console.warn('Unauthorized access attempt');
          navigate('/');
          return;
        }
        
        // Artificial synchronization delay
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Security check failed:', error);
        navigate('/');
      }
    };

    checkAccess();
  }, [navigate]);

  const filteredSales = useMemo(() => {
    let filtered = [...allSales];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === now.getTime();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() >= weekAgo.getTime();
      });
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      monthAgo.setHours(0, 0, 0, 0);
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() >= monthAgo.getTime();
      });
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
  }, [allSales, statusFilter, dateFilter, searchTerm]);

  // Calculate metrics
  const totalRevenue = filteredSales
    .filter(s => s.status === 'PAID')
    .reduce((sum, sale) => sum + (sale.amount || 0), 0);

  const paidCount = filteredSales.filter(s => s.status === 'PAID').length;
  const unpaidCount = filteredSales.filter(s => s.status === 'UNPAID' || s.status === 'pending').length;
  const totalOrders = filteredSales.length;

  // Chart data - Revenue by day
  const revenueByDay = useMemo(() => {
    const data = filteredSales
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
    
    // For 60 days view, we might want to group by week if too many points, 
    // but recharts handles 60 points okay-ish. Let's slice for trend.
    return Object.values(data).reverse();
  }, [filteredSales]);

  const revenueChartData = revenueByDay.slice(-14); // Last 14 days for trend

  // Status distribution
  const statusData = [
    { name: 'PAID', value: paidCount, color: '#10b981' },
    { name: 'UNPAID', value: unpaidCount, color: '#f59e0b' }
  ];

  // Top products
  const productStats = useMemo(() => {
    const stats = filteredSales
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
    
    return Object.values(stats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredSales]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Synchronizing Sales Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Revenue Ecosystem eL Vision</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search database..."
                className="bg-transparent border-none outline-none text-white placeholder-purple-300 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-300" />
              <select
                className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-white/20 outline-none cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="60days">Last 60 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="week">Last 7 Days</option>
                <option value="today">Today</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-300" />
              <select
                className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-white/20 outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="PAID">Paid Only</option>
                <option value="UNPAID">Unpaid Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <Banknote className="w-10 h-10 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">Net Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-emerald-300 text-sm">Total revenue from paid transactions</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-10 h-10 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">Active Orders</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalOrders.toLocaleString('id-ID')}</div>
            <div className="text-blue-300 text-sm">Total order volume processed</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">Paid Rate</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{paidCount.toLocaleString('id-ID')}</div>
            <div className="text-purple-300 text-sm">Successful payment completion</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold">Pending</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{unpaidCount.toLocaleString('id-ID')}</div>
            <div className="text-orange-300 text-sm">Awaiting checkout completion</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Daily Revenue Velocity</h3>
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
            <h3 className="text-xl font-bold text-white mb-4">Transaction Health</h3>
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
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="product" stroke="#ffffff80" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={80} />
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
            <h3 className="text-xl font-bold text-white">Transaction History</h3>
            <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Dataset
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Customer</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Product</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Identifier</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Amount</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Status</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(0, 100).map((sale) => (
                  <tr key={sale.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{sale.name || '-'}</td>
                    <td className="py-3 px-4 text-white">{sale.product_name || '-'}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{sale.email || '-'}</td>
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
                Synchronizing data...
              </div>
            )}
            {filteredSales.length > 100 && (
              <div className="text-center py-4 text-purple-400 text-sm italic">
                Optimized view: Showing most recent 100 entries...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSalesAdmin;
