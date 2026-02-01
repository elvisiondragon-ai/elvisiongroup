import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link, CreditCard, Share2, Coins, CalendarDays, ArrowRight, Landmark, Wallet, History, ExternalLink, Users, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subDays, isAfter, parseISO, isSameDay } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface Commission {
  id: string;
  user_email: string;
  product_name: string;
  sale_date: string;
  sale_amount: number;
  commission_percentage: number;
  commission_amount: number;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

const productOptions = [
  { name: 'Fitfactor LP', url: 'https://app.elvisiongroup.com/fitfactorlp', commission: '30%' },
  { name: 'eL Royale Parfum', url: 'https://app.elvisiongroup.com/elroyaleparfum', commission: '30%' },
  { name: 'Drelf', url: 'https://app.elvisiongroup.com/drelf', commission: '30%' },
  { name: 'Hungry Later Diet', url: 'https://app.elvisiongroup.com/ebook_langsing', commission: '30%' },
  { name: 'Ebook eL Vision', url: 'https://app.elvisiongroup.com/ebook_elvision', commission: '30%' },
  { name: 'Sistem Uang Panas', url: 'https://app.elvisiongroup.com/uangpanas', commission: '50%' },
];

type TimeFilter = 'today' | 'last7' | 'last30' | 'all';

export default function AffiliatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [productUrlInput, setProductUrlInput] = useState<string>(productOptions[0].url); 
  const [generatedAffiliateLink, setGeneratedAffiliateLink] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');

  // Bank details state
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        setAffiliateCode(user.id);

        // Parallel Fetching
        const [commissionsResult, profileResult, withdrawalsResult] = await Promise.all([
          supabase
            .from('commissions')
            .select('*')
            .eq('affiliate_user_id', user.id)
            .order('sale_date', { ascending: false }),
          supabase
            .from('profiles')
            .select('bank_name, account_number, account_holder, display_name')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('withdrawals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        // Process Commissions
        if (commissionsResult.error) throw commissionsResult.error;
        setCommissions(commissionsResult.data || []);

        // Process Profile
        if (profileResult.error && profileResult.error.code !== 'PGRST116') throw profileResult.error;
        if (profileResult.data) {
          setBankName(profileResult.data.bank_name || '');
          setAccountNumber(profileResult.data.account_number || '');
          setAccountHolder(profileResult.data.account_holder || '');
          setDisplayName(profileResult.data.display_name);
        }

        // Process Withdrawals
        if (withdrawalsResult.error) throw withdrawalsResult.error;
        setWithdrawals(withdrawalsResult.data || []);

      } catch (err: any) {
        console.error("Error fetching affiliate data:", err.message);
        setError("Gagal memuat data afiliasi: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, [user]);

  const saveBankDetails = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bank_name: bankName,
          account_number: accountNumber,
          account_holder: accountHolder,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast({ title: "Berhasil", description: "Detail bank berhasil disimpan." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const requestWithdrawal = async (amount: number) => {
    if (!user) return;
    if (!bankName || !accountNumber || !accountHolder) {
      toast({ title: "Gagal", description: "Lengkapi detail bank Anda terlebih dahulu.", variant: "destructive" });
      return;
    }
    if (amount < 50000) {
      toast({ title: "Gagal", description: "Minimal pencairan adalah Rp 50.000.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('withdrawals').insert({
        user_id: user.id,
        amount: amount,
        affiliate_email: user.email,
        bank_snapshot: { bankName, accountNumber, accountHolder }
      });

      if (error) throw error;
      toast({ title: "Berhasil", description: "Permintaan pencairan berhasil dikirim." });
      
      // Refresh withdrawals
      const { data } = await supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setWithdrawals(data || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Logic
  const filterByDate = (dateString: string) => {
    const date = parseISO(dateString);
    const now = new Date();
    
    switch (timeFilter) {
      case 'today':
        return isSameDay(date, now);
      case 'last7':
        return isAfter(date, subDays(now, 7));
      case 'last30':
        return isAfter(date, subDays(now, 30));
      case 'all':
        return true;
      default:
        return true;
    }
  };

  const filteredCommissions = React.useMemo(() => commissions.filter(c => filterByDate(c.sale_date)), [commissions, timeFilter]);
  const filteredWithdrawals = React.useMemo(() => withdrawals.filter(w => filterByDate(w.created_at)), [withdrawals, timeFilter]);

  // Display Stats (Filtered)
  const displayTotalCommission = React.useMemo(() => filteredCommissions.reduce((sum, c) => sum + c.commission_amount, 0), [filteredCommissions]);
  const displayPaidOut = React.useMemo(() => filteredWithdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0), [filteredWithdrawals]);

  // Wallet Balance (Always All Time)
  const allTimeCommission = React.useMemo(() => commissions.reduce((sum, c) => sum + c.commission_amount, 0), [commissions]);
  const allTimePaidOut = React.useMemo(() => withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0), [withdrawals]);
  const allTimePending = React.useMemo(() => withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0), [withdrawals]);
  const currentBalance = React.useMemo(() => allTimeCommission - allTimePaidOut - allTimePending, [allTimeCommission, allTimePaidOut, allTimePending]);

  const generateAffiliateLink = () => {
    if (!affiliateCode) return;
    try {
      const url = new URL(productUrlInput);
      url.searchParams.set('ref', affiliateCode);
      setGeneratedAffiliateLink(url.toString());
      toast({ title: "Berhasil", description: "Link afiliasi berhasil dibuat." });
    } catch (e: any) {
      toast({ title: "Error", description: "URL tidak valid.", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast({ title: "Berhasil Disalin", description: "Teks disalin ke clipboard." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 pb-20">
        <div className="max-w-4xl mx-auto py-12 space-y-8">
          {/* Skeleton Header */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 h-40 animate-pulse">
             <Skeleton className="h-8 w-64 mb-4 bg-gray-800" />
             <Skeleton className="h-4 w-32 bg-gray-800" />
          </div>

          {/* Skeleton Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 h-32 animate-pulse">
                <Skeleton className="h-4 w-24 mb-4 bg-gray-800" />
                <Skeleton className="h-8 w-32 bg-gray-800" />
              </div>
            ))}
          </div>

          {/* Skeleton Bank Details */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 h-64 animate-pulse">
             <Skeleton className="h-6 w-48 mb-6 bg-gray-800" />
             <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full bg-gray-800" />
                <Skeleton className="h-10 w-full bg-gray-800" />
                <Skeleton className="h-10 w-full bg-gray-800" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4"><Button onClick={() => navigate('/auth')}>Login</Button></div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {displayName && (
          <Card className="bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-transparent border-yellow-500/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users size={80} className="text-yellow-500" />
            </div>
            <CardContent className="p-6 flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-black font-bold text-xl">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-yellow-400/80 text-sm font-medium uppercase tracking-wider">Selamat Datang</p>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  <span className="text-yellow-400">{displayName}</span>
                </h2>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Header & Filter Card */}
        <Card className="bg-gradient-to-br from-yellow-900/20 via-black to-black border-yellow-500/20 overflow-hidden relative shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-600 bg-clip-text text-transparent tracking-tight">
                Dashboard Afiliasi
              </h1>
              <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">eL Vision Group</p>
              {user?.email && ['elvisiondragon@gmail.com', 'dragon@yahoo.com', 'elreyzandra@gmail.com'].includes(user.email) && (
                <Button 
                  onClick={() => navigate('/admin/withdrawals')}
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-black font-bold h-8 text-xs"
                >
                  Manage Payouts (Admin)
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3 bg-gray-900/50 p-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
              <div className="pl-3 flex items-center gap-2 text-gray-400">
                <Filter className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline-block">Filter Waktu</span>
              </div>
              <div className="w-[180px]">
                <Select onValueChange={(value) => setTimeFilter(value as TimeFilter)} defaultValue={timeFilter}>
                  <SelectTrigger className="w-full bg-black/40 border-0 focus:ring-1 focus:ring-yellow-500/50 text-white h-9 text-sm font-medium">
                    <SelectValue placeholder="Pilih Waktu" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="last7">7 Hari Terakhir</SelectItem>
                    <SelectItem value="last30">30 Hari Terakhir</SelectItem>
                    <SelectItem value="all">Semua Waktu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-yellow-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Pendapatan ({timeFilter === 'today' ? 'Hari Ini' : timeFilter === 'last7' ? '7 Hari' : timeFilter === 'last30' ? '30 Hari' : 'Total'})</CardTitle>
              <Coins className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{displayTotalCommission.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-green-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Dicairkan ({timeFilter === 'today' ? 'Hari Ini' : timeFilter === 'last7' ? '7 Hari' : timeFilter === 'last30' ? '30 Hari' : 'Total'})</CardTitle>
              <History className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{displayPaidOut.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-blue-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Saldo Aktif (Real-time)</CardTitle>
              <Wallet className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{currentBalance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
              {currentBalance >= 50000 && (
                <Button 
                  onClick={() => requestWithdrawal(currentBalance)} 
                  disabled={submitting}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-sm h-8"
                >
                  Tarik Saldo
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bank Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2 flex items-center gap-2">
            <Landmark className="w-6 h-6" /> Informasi Rekening Bank
          </h2>
          <p className="text-xs text-gray-400 mb-4 bg-yellow-900/20 border border-yellow-500/20 p-2 rounded">
            ⚠️ <strong>Perhatian:</strong> Selain Bank BCA akan dikenakan biaya admin <strong>Rp 6.500</strong> per transaksi karena dana ditransfer dari Bank BCA.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400">Nama Bank</label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="BCA / Mandiri" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Nomor Rekening</label>
              <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="12345678" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Nama Pemilik</label>
              <Input value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Nama Sesuai Bank" className="bg-gray-800 border-gray-700" />
            </div>
          </div>
          <Button onClick={saveBankDetails} disabled={submitting} className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-black font-bold">
            Simpan Rekening
          </Button>
        </div>

        {/* Affiliate Link Generator */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <Link className="w-6 h-6" /> Generator Link Afiliasi
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-select" className="block text-gray-300 text-sm font-medium mb-1">Pilih Produk:</label>
              <Select onValueChange={setProductUrlInput} defaultValue={productUrlInput}>
                <SelectTrigger id="product-select" className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Pilih produk untuk afiliasi" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {productOptions.map((option) => (
                    <SelectItem key={option.url} value={option.url}>
                      {option.name} ({option.commission})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={generateAffiliateLink}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2"
            >
              Buat Link Afiliasi <ArrowRight className="w-4 h-4" />
            </Button>
            {generatedAffiliateLink && (
              <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-md flex items-center space-x-2">
                <Input
                  type="text"
                  value={generatedAffiliateLink}
                  readOnly
                  className="flex-grow bg-transparent border-none text-green-300 font-mono text-sm"
                />
                <Button
                  onClick={() => copyToClipboard(generatedAffiliateLink)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 h-auto"
                >
                  Salin
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Affiliate Marketing Tools */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-900/30 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <Share2 className="w-6 h-6" /> Affiliate Marketing Tools
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Gunakan materi promosi di bawah ini untuk membantu Anda mendapatkan penjualan lebih cepat.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white flex items-center justify-between h-auto py-4 px-6"
              onClick={() => navigate('/leadmagnet')}
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-bold text-red-400">Check ebook anda atau hubungi admin untuk lead magnet</span>
                <span className="text-xs text-gray-400">Ambil Url di ebook anda</span>
              </div>
              <ExternalLink className="w-5 h-5 text-red-400" />
            </Button>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <Coins className="w-6 h-6" /> Struktur Komisi
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-300">
                  <th className="py-2 px-4">Nama Produk</th>
                  <th className="py-2 px-4 text-right">Besar Komisi</th>
                </tr>
              </thead>
              <tbody>
                {productOptions.map((product) => (
                  <tr key={product.url} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-gray-300 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.commission === '50%' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' : 
                        'bg-blue-900/50 text-blue-400 border border-blue-500/30'
                      }`}>
                        {product.commission}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission History */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <CalendarDays className="w-6 h-6" /> Riwayat Komisi
          </h2>
          {filteredCommissions.length === 0 ? (
            <p className="text-gray-400">Belum ada komisi tercatat untuk periode ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-300">
                    <th className="py-2 px-4">Produk</th>
                    <th className="py-2 px-4">Tanggal</th>
                    <th className="py-2 px-4">Penjualan</th>
                    <th className="py-2 px-4">Komisi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-2 px-4 text-gray-300">{commission.product_name}</td>
                      <td className="py-2 px-4 text-gray-400">{new Date(commission.sale_date).toLocaleDateString('id-ID')}</td>
                      <td className="py-2 px-4 text-gray-300">{commission.sale_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                      <td className="py-2 px-4 text-green-400 font-semibold">{commission.commission_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Withdrawal History */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-900/30 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <History className="w-6 h-6" /> Riwayat Penarikan
          </h2>
          {filteredWithdrawals.length === 0 ? (
            <p className="text-gray-400">Belum ada penarikan untuk periode ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-300">
                    <th className="py-2 px-4">Tanggal</th>
                    <th className="py-2 px-4">Jumlah</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-2 px-4 text-gray-300">{new Date(w.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="py-2 px-4 text-gray-300">{w.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          w.status === 'approved' ? 'bg-green-900 text-green-300' : 
                          w.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 
                          'bg-red-900 text-red-300'
                        }`}>
                          {w.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}