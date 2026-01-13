import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link, CreditCard, Share2, DollarSign, CalendarDays, ArrowRight, Landmark, Wallet, History, ExternalLink } from 'lucide-react';
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
  { name: 'Fitfactor', url: 'https://app.elvisiongroup.com/fitfactor' },
  { name: 'eL Royale Parfum', url: 'https://app.elvisiongroup.com/parfum' },
  { name: 'eL Royale Jewelry', url: 'https://app.elvisiongroup.com/jewelry' },
  { name: 'Drelf', url: 'https://app.elvisiongroup.com/drelf' },
  { name: 'Hungry Later Diet', url: 'https://app.elvisiongroup.com/diet' },
  { name: 'Ebook eL Vision', url: 'https://app.elvisiongroup.com/ebook_elvision' },
  { name: 'Sistem Uang Panas (Komisi 50%)', url: 'https://app.elvisiongroup.com/uangpanas' },
];

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

  // Bank details state
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        setAffiliateCode(user.id);

        // Fetch commissions
        const { data: commissionData, error: commissionError } = await supabase
          .from('commissions')
          .select('*')
          .eq('affiliate_user_id', user.id)
          .order('sale_date', { ascending: false });

        if (commissionError) throw commissionError;
        setCommissions(commissionData || []);

        // Fetch bank details from profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('bank_name, account_number, account_holder')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        if (profileData) {
          setBankName(profileData.bank_name || '');
          setAccountNumber(profileData.account_number || '');
          setAccountHolder(profileData.account_holder || '');
        }

        // Fetch withdrawals
        const { data: withdrawalData, error: withdrawalError } = await supabase
          .from('withdrawals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (withdrawalError) throw withdrawalError;
        setWithdrawals(withdrawalData || []);

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

  const totalCommission = commissions.reduce((sum, c) => sum + c.commission_amount, 0);
  const paidOut = withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0);
  const pendingPayout = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);
  const currentBalance = totalCommission - paidOut - pendingPayout;

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

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><p>Memuat...</p></div>;
  if (!user) return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4"><Button onClick={() => navigate('/auth')}>Login</Button></div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        <h1 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
          Dashboard Afiliasi
        </h1>

        {/* Finance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-yellow-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Total Pendapatan</CardTitle>
              <DollarSign className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalCommission.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-green-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Sudah Dicairkan</CardTitle>
              <History className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{paidOut.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-blue-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">Saldo Aktif</CardTitle>
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
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <Landmark className="w-6 h-6" /> Informasi Rekening Bank
          </h2>
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
                      {option.name}
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
              onClick={() => window.open('https://drive.google.com/drive/folders/184nCdZgEMj61JLUXyXt6pPU-7XOMMljd?usp=share_link', '_blank')}
            >
              <div className="flex flex-col items-start text-left">
                <span className="font-bold text-red-400">Lead Magnet Konten Uang Panas</span>
                <span className="text-xs text-gray-400">Strategi 7 Lead Magnet & Script</span>
              </div>
              <ExternalLink className="w-5 h-5 text-red-400" />
            </Button>
          </div>
        </div>

        {/* Commission History */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <CalendarDays className="w-6 h-6" /> Riwayat Komisi
          </h2>
          {commissions.length === 0 ? (
            <p className="text-gray-400">Belum ada komisi tercatat.</p>
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
                  {commissions.map((commission) => (
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
          {withdrawals.length === 0 ? (
            <p className="text-gray-400">Belum ada penarikan.</p>
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
                  {withdrawals.map((w) => (
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

