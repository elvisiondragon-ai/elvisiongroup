import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link, CreditCard, Share2, DollarSign, CalendarDays, ArrowRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Shadcn UI Select components

interface Commission {
  id: string;
  user_email: string; // Added user_email
  product_name: string;
  sale_date: string; // ISO date string
  sale_amount: number;
  commission_percentage: number;
  commission_amount: number;
}

const productOptions = [
  { name: 'Fitfactor', url: 'https://app.elvisiongroup.com/fitfactor' },
  { name: 'eL Royale Parfum', url: 'https://app.elvisiongroup.com/parfum' },
  { name: 'eL Royale Jewelry', url: 'https://app.elvisiongroup.com/jewelry' },
  { name: 'Drelf', url: 'https://app.elvisiongroup.com/drelf' },
  { name: 'Hungry Later Diet', url: 'https://app.elvisiongroup.com/diet' },
  { name: 'Ebook eL Vision', url: 'https://app.elvisiongroup.com/ebook_elvision' },
];

export default function AffiliatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize useNavigate
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  // Initialize with the URL of the first product option
  const [productUrlInput, setProductUrlInput] = useState<string>(productOptions[0].url); 
  const [generatedAffiliateLink, setGeneratedAffiliateLink] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use user.id directly as the affiliate code as suggested
        setAffiliateCode(user.id);

        // Fetch commissions for the current user
        const { data: commissionData, error: commissionError } = await supabase
          .from('commissions')
          .select('*')
          .eq('affiliate_user_id', user.id)
          .order('sale_date', { ascending: false });

        if (commissionError) throw commissionError;
        setCommissions(commissionData || []);

      } catch (err: any) {
        console.error("Error fetching affiliate data:", err.message);
        setError("Gagal memuat data afiliasi: " + err.message);
        toast({
          title: "Error",
          description: "Gagal memuat data afiliasi. Silakan coba lagi.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, [user, toast]);

  const generateAffiliateLink = () => {
    if (!affiliateCode) {
      toast({
        title: "Error",
        description: "Kode afiliasi tidak tersedia.",
        variant: "destructive",
      });
      return;
    }
    if (!productUrlInput) {
      toast({
        title: "Peringatan",
        description: "Mohon masukkan URL produk.",
        variant: "warning",
      });
      return;
    }

    try {
      const url = new URL(productUrlInput);
      url.searchParams.set('ref', affiliateCode);
      setGeneratedAffiliateLink(url.toString());
      toast({
        title: "Berhasil",
        description: "Link afiliasi berhasil dibuat.",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: "URL produk tidak valid: " + e.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast({
        title: "Berhasil Disalin",
        description: "Link afiliasi telah disalin ke clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Memuat data afiliasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-lg">Anda perlu login untuk melihat halaman afiliasi.</p>
        <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
          Login
        </Button>
      </div>
    );
  }

  const totalCommission = commissions.reduce((sum, c) => sum + c.commission_amount, 0);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
          Dashboard Afiliasi
        </h1>

        {/* Affiliate Code Section */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <Share2 className="w-6 h-6" /> Kode Afiliasi Anda
          </h2>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              value={affiliateCode || 'Membuat kode...'}
              readOnly
              className="flex-grow bg-gray-800 border-gray-700 text-yellow-300 font-mono"
            />
            <Button
              onClick={() => copyToClipboard(affiliateCode)}
              disabled={!affiliateCode}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
            >
              Salin
            </Button>
          </div>
          <p className="text-gray-400 text-sm mt-2">Gunakan kode ini dalam link produk Anda.</p>
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

        {/* Commission Summary */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-green-900/30 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6" /> Total Komisi Anda
          </h2>
          <p className="text-5xl font-bold text-green-300">
            {totalCommission.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </p>
          <p className="text-gray-400 mt-2">Dapatkan 30% dari setiap penjualan produk melalui link Anda.</p>
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
                    <th className="py-2 px-4">Tanggal Penjualan</th>
                    <th className="py-2 px-4">Jumlah Penjualan</th>
                    <th className="py-2 px-4">Komisi (%)</th>
                    <th className="py-2 px-4">Jumlah Komisi</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-2 px-4 text-gray-300">{commission.product_name}</td>
                      <td className="py-2 px-4 text-gray-400">{new Date(commission.sale_date).toLocaleDateString('id-ID')}</td>
                      <td className="py-2 px-4 text-gray-300">{commission.sale_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                      <td className="py-2 px-4 text-gray-400">{commission.commission_percentage}%</td>
                      <td className="py-2 px-4 text-green-400 font-semibold">{commission.commission_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
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
