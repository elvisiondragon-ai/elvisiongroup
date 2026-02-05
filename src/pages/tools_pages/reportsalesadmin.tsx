import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Banknote, ShoppingCart, Users, Calendar, Filter, Download, Search, LayoutGrid, List as ListIcon, BarChart3 } from 'lucide-react';

const ReportSalesAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [topPerformView, setTopPerformView] = useState('chart'); // 'chart' or 'list'
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');

  const EXCHANGE_RATE = 16000; // 1 USD = 16,000 IDR

  const formatCurrency = (amount: number) => {
    if (currency === 'USD') {
      return `$${(amount / EXCHANGE_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // Realistic Stats Constants
  const TOTAL_REVENUE = 609523000;
  const TOTAL_ORDERS = 2134;
  const PAID_RATIO = 0.8;
  const PAID_COUNT = Math.round(TOTAL_ORDERS * PAID_RATIO);
  const UNPAID_COUNT = TOTAL_ORDERS - PAID_COUNT;

  const PRODUCT_PRICES = {
    "eL Royale Parfum": 555000,
    "Obat Kuat BPOM": 300000,
    "Drelf": 550000,
    "Hungry Later": 450000,
    "Fit Factor": 400000,
    "Ebook Uang Panas": 100000,
    "Ebook Feminine": 100000,
    "Ebook Tracker": 100000,
  };

  const MOCK_NAMES = [
    "Agus", "Bambang", "Cipto", "Dedi", "Eko", "Fajar", "Gilang", "Hendra", "Iwan", "Joko",
    "Kiki", "Lukman", "Mamat", "Nanang", "Oki", "Purnomo", "Qibil", "Rian", "Slamet", "Tono",
    "Ujang", "Vicky", "Wawan", "Yanto", "Zainal", "Ayu", "Bella", "Citra", "Dinda", "Endang",
    "Fitri", "Gita", "Hani", "Indah", "Juwita", "Kartika", "Lilis", "Maya", "Nining", "Olla",
    "Puput", "Rini", "Santi", "Titi", "Ussy", "Vina", "Winda", "Yuli", "Zaskia", "Boim",
    "Adi Nugraha", "Bayu Saputra", "Cahya Kamila", "Dimas Anggara", "Eka Pertiwi", "Farid Harja", "Guntur Bumi", "Hadi Santoso", "Indra Lesmana", "Jaya Suprana",
    "Kevin Sanjaya", "Lestari Puji", "Miko Wijaya", "Nurul Hidayah", "Opick Tombo", "Pandu Winata", "Qory Sandioriva", "Radit Dika", "Sari Rahayu", "Taufik Hidayat",
    "Usman Harun", "Vira Talisa", "Wahyu Setyo", "Yoga Pratama", "Zulfikar Ali", "Rahmat Hidayat", "Susi Susanti", "Budi Santoso", "Ani Yuliani", "Dewi Sartika",
    "Eko Prasetyo", "Feri Irawan", "Galih Ginanjar", "Herman Felani", "Intan Nuraini", "Jaja Sudrajat", "Kaka Wardhana", "Lulu Lutfiah", "Merry Andani", "Nanda Persada",
    "Ozy Syahputra", "Pasha Ungu", "Qomarudin Syarif", "Rina Nose", "Sule Prikitiew", "Tukul Arwana", "Uya Kuya", "Vega Darwanti", "Wendy Cagur", "Yuni Shara",
    "Asep Knalpot", "Budi Koley", "Caca Marica", "Dodo Sosis", "Euis Cicalengka", "Fajar Sadboy", "Gengges", "Hesti Galon", "Ipul Kancut", "Joni Jengkol",
    "Karyo Sate", "Leman Kicau", "Mimin Mintje", "Nadia Pasirimpun", "Ncep Kasep", "Oding Dangdut", "Parto Panci", "Qiting", "Rijal Cileunyi", "Sopyan Cilok",
    "Tatang Listrik", "Ucup Bajuri", "Viko Vidi Vici", "Wawan Spion", "Yana Cukur", "Zul Zong", "Iwan Bopeng", "Siska Kolbak", "Roni Rongsok", "Yuni Shampo",
    "Tono Teras", "Desi Daster", "Asep Kopi", "Ujang Rambo", "Titin Catering", "Wulan Laundry", "Jamal Jangkrik", "Kodir Ojek", "Lela Lele", "Nunung Nasi Uduk",
    "Oji Ojol", "Pepen Penyu", "Qoriah Qasidah", "Rinto Roti", "Somad Somay", "Tini Tahu", "Unang Unggas", "Vian Vixion", "Wiro Wajan", "Yudi Yoyo"
  ];

  const [sales, setSales] = useState([]);

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
      
      generateRealisticData();
    } catch (error) {
      console.error('Error checking access:', error);
      navigate('/');
    }
  };

  const generateRealisticData = () => {
    const products = Object.keys(PRODUCT_PRICES);
    const generatedSales = [];
    const now = new Date("2026-02-05T12:00:00Z");
    
    const counts = {
      "eL Royale Parfum": 350,
      "Drelf": 300,
      "Hungry Later": 200,
      "Fit Factor": 200,
      "Obat Kuat BPOM": 200,
      "Ebook Uang Panas": 150,
      "Ebook Feminine": 150,
      "Ebook Tracker": 157
    };

    // Prepare all order definitions first
    const orderPool: { product: string; status: string }[] = [];
    
    // Add Paid orders to pool
    Object.entries(counts).forEach(([product, count]) => {
      for (let i = 0; i < count; i++) {
        orderPool.push({ product, status: 'PAID' });
      }
    });

    // Add Unpaid orders to pool
    for (let i = 0; i < UNPAID_COUNT; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      orderPool.push({ product, status: 'UNPAID' });
    }

    // Shuffle is not strictly necessary as we'll sort by date, 
    // but generating them with the same date distribution is key.
    orderPool.forEach((order, idx) => {
      const nameIndex = Math.floor(Math.random() * MOCK_NAMES.length);
      const name = MOCK_NAMES[nameIndex];
      
      // Use SAME distribution for both to maintain 80/20 ratio at any point in history
      const dayOffset = Math.floor(Math.pow(Math.random(), 1.5) * 60);
      const saleDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      saleDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      generatedSales.push({
        id: `sale-${idx}`,
        name: name,
        product_name: order.product,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        amount: PRODUCT_PRICES[order.product as keyof typeof PRODUCT_PRICES],
        status: order.status,
        created_at: saleDate.toISOString()
      });
    });

    generatedSales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setSales(generatedSales);
    setLoading(false);
  };

  const filterSales = () => {
    let filtered = [...sales];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    // Date filter
    const now = new Date("2026-02-05T12:00:00Z");
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    if (dateFilter === 'today') {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === todayStart.getTime();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(todayStart);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(sale => new Date(sale.created_at) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(todayStart);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(sale => new Date(sale.created_at) >= monthAgo);
    } else if (dateFilter === '60days') {
      const days60Ago = new Date(todayStart);
      days60Ago.setDate(days60Ago.getDate() - 60);
      filtered = filtered.filter(sale => new Date(sale.created_at) >= days60Ago);
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

  // Metrics
  const currentRevenue = filteredSales
    .filter(s => s.status === 'PAID')
    .reduce((sum, sale) => sum + (sale.amount || 0), 0);
  
  const currentPaidCount = filteredSales.filter(s => s.status === 'PAID').length;
  const currentUnpaidCount = filteredSales.filter(s => s.status === 'UNPAID').length;
  const currentTotalOrders = filteredSales.length;

  // Chart data - Revenue by day (Realistic Trend)
  const getRevenueChartData = () => {
    const data = [];
    const now = new Date("2026-02-05T12:00:00Z");
    let daysToShow = 30;

    if (dateFilter === 'today') daysToShow = 1;
    else if (dateFilter === 'week') daysToShow = 7;
    else if (dateFilter === 'month') daysToShow = 30;
    else if (dateFilter === '60days') daysToShow = 60;
    else if (dateFilter === 'all') daysToShow = 60;

    // Create a map of revenue per date key
    const revenueMap: Record<string, number> = {};
    filteredSales.forEach(sale => {
      if (sale.status === 'PAID') {
        const key = new Date(sale.created_at).toISOString().split('T')[0];
        revenueMap[key] = (revenueMap[key] || 0) + (sale.amount || 0);
      }
    });

    // Generate continuous timeline
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dateDisplay = d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
      
      data.push({ 
        date: dateDisplay, 
        revenue: revenueMap[dateKey] || 0 
      });
    }
    return data;
  };

  const revenueChartData = getRevenueChartData();

  // Status distribution
  const statusData = [
    { name: 'PAID', value: currentPaidCount, color: '#10b981' },
    { name: 'UNPAID', value: currentUnpaidCount, color: '#f59e0b' }
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
    .sort((a, b) => b.revenue - a.revenue);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading realistic analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">eL Vision Revenue</h1>
            <p className="text-purple-300">Performance</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search transactions..."
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
                <option value="60days">Last 60 Days</option>
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
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 ml-auto">
              <button 
                onClick={() => setCurrency('IDR')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${currency === 'IDR' ? 'bg-emerald-600 text-white' : 'text-purple-300 hover:text-white'}`}
              >
                IDR
              </button>
              <button 
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-purple-300 hover:text-white'}`}
              >
                USD
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <Banknote className="w-10 h-10 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(currentRevenue)}
            </div>
            <div className="text-emerald-300 text-sm">Total revenue from paid orders</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-10 h-10 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">Orders</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{currentTotalOrders.toLocaleString('id-ID')}</div>
            <div className="text-blue-300 text-sm">Total orders placed</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">Paid</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {currentPaidCount.toLocaleString('id-ID')}
            </div>
            <div className="text-purple-300 text-sm">Successful sales</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold">Unpaid</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {currentUnpaidCount.toLocaleString('id-ID')}
            </div>
            <div className="text-orange-300 text-sm">Pending orders</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff80" />
                <YAxis 
                  stroke="#ffffff80"
                  width={80}
                  tickFormatter={(value) => {
                    if (currency === 'USD') {
                      if (value >= 1000) return `$${(value / EXCHANGE_RATE / 1000).toFixed(1)}k`;
                      return `$${(value / EXCHANGE_RATE).toFixed(0)}`;
                    }
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value;
                  }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
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
                  label={({ name, value }) => `${name} ${value}`}
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

        {/* Top Performing Products Section with Toggle */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Top Performing Products</h3>
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setTopPerformView('chart')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${topPerformView === 'chart' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'}`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Chart</span>
              </button>
              <button 
                onClick={() => setTopPerformView('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${topPerformView === 'list' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:text-white'}`}
              >
                <ListIcon className="w-4 h-4" />
                <span className="text-sm font-medium">List</span>
              </button>
            </div>
          </div>

          {topPerformView === 'chart' ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  type="number"
                  stroke="#ffffff80"
                  tickFormatter={(value) => {
                    if (currency === 'USD') return `$${(value / EXCHANGE_RATE / 1000).toFixed(1)}k`;
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    return value;
                  }}
                />
                <YAxis dataKey="product" type="category" stroke="#ffffff" width={150} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff30', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Total Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProducts.map((item, index) => (
                <div key={item.product} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full mb-2 inline-block">#{index + 1}</span>
                      <h4 className="text-white font-bold text-lg">{item.product}</h4>
                      <p className="text-purple-300 text-sm">Unit Price: {formatCurrency(PRODUCT_PRICES[item.product as keyof typeof PRODUCT_PRICES])}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-purple-300 uppercase">Total Sales</p>
                      <p className="text-white font-semibold">{item.count} Units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-400 uppercase">Total Revenue</p>
                      <p className="text-xl font-black text-emerald-400">{formatCurrency(item.revenue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sales Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Transaction list</h3>
            <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export Mock Data
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Customer</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Product</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Email</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Amount</th>
                  <th className="text-left text-purple-300 font-semibold py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(0, 150).map((sale) => (
                  <tr key={sale.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{sale.name || '-'}</td>
                    <td className="py-3 px-4 text-white">{sale.product_name || '-'}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{sale.email || '-'}</td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {formatCurrency(sale.amount || 0)}
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
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSales.length === 0 && (
              <div className="text-center py-8 text-purple-300">
                No data matches your filter
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSalesAdmin;