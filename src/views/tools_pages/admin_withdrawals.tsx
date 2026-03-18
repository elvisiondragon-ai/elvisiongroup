"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Download, 
  CheckCircle2, 
  ArrowLeft,
  RefreshCw,
  History
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PayoutItem {
  id: string;
  display_name: string;
  email: string;
  amount: number;
  status: string;
  created_at: string;
  bank_snapshot: any;
}

const AdminWithdrawals = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [queueItems, setQueueItems] = useState<PayoutItem[]>([]);
  const [historyItems, setHistoryItems] = useState<PayoutItem[]>([]); // Reusing interface for simplicity
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('queue');

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const allowedEmails = ['elvisiondragon@gmail.com', 'dragon@yahoo.com', 'elreyzandra@gmail.com'];
      
      if (!user || !user.email || !allowedEmails.includes(user.email)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive"
        });
        router.push('/');
        return;
      }
      
      fetchData();
    } catch (error) {
      console.error('Error checking access:', error);
      router.push('/');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Queue (Pending) from View
      const queueRes = await (supabase as any)
        .from('admin_payout_queue')
        .select('*')
        .order('created_at', { ascending: true });

      if (queueRes.error) throw queueRes.error;
      setQueueItems(queueRes.data || []);

      // Fetch History (Non-pending) directly from withdrawals + joins to match structure
      // Note: admin_payout_queue view ONLY contains pending. 
      // So for history we must query withdrawals and join manually or create another view.
      // For now, let's just query withdrawals and try to map it.
      // Ideally we should have a 'admin_withdrawals_all' view, but let's try raw query
      const historyRes = await (supabase as any)
        .from('withdrawals')
        .select(`
          id,
          amount,
          status,
          created_at,
          bank_snapshot,
          user_id,
          affiliate_email,
          profiles:user_id ( display_name )
        `)
        .neq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(50); // Limit history for performance

       // We need email, but standard relationship might be tricky if not set up.
       // For history, maybe display_name is enough or we rely on what we have.
       // Mapping to PayoutItem
       const mappedHistory = (historyRes.data || []).map((h: any) => ({
          id: h.id,
          display_name: h.profiles?.display_name || 'Unknown',
          email: h.affiliate_email || 'No Email',
          amount: h.amount,
          status: h.status,
          created_at: h.created_at,
          bank_snapshot: h.bank_snapshot
       }));
       
       setHistoryItems(mappedHistory);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id: string) => {
    setUpdatingId(id);
    try {
      const { error } = await (supabase as any)
        .from('withdrawals')
        .update({ status: 'paid' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Withdrawal marked as PAID",
      });

      // Remove from queue locally
      setQueueItems(prev => prev.filter(item => item.id !== id));
      
      // Refresh to update history
      fetchData();

    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredQueue = queueItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.display_name?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      item.amount.toString().includes(searchLower)
    );
  });

  const filteredHistory = historyItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.display_name?.toLowerCase().includes(searchLower) ||
      item.amount.toString().includes(searchLower)
    );
  });

  const renderTable = (items: PayoutItem[], isQueue: boolean) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/50 border-b border-gray-800">
              <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Affiliate</th>
              <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Amount</th>
              <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Bank Details</th>
              <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Date</th>
              <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider">Status</th>
              <th className="p-4 text-gray-400 font-medium uppercase text-xs tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{item.display_name || 'Unknown'}</span>
                    <span className="text-xs text-gray-500">{item.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-lg font-mono font-bold text-yellow-500">
                    Rp {item.amount.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="p-4">
                  {item.bank_snapshot ? (
                    <div className="text-xs space-y-1 bg-black/40 p-2 rounded border border-gray-800">
                      <div className="flex justify-between">
                         <span className="text-gray-500">Bank:</span>
                         <span className="text-gray-300 font-semibold">{item.bank_snapshot.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">No:</span>
                         <span className="text-white font-mono">{item.bank_snapshot.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-500">Name:</span>
                         <span className="text-gray-400">{item.bank_snapshot.accountHolder}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-red-500 text-xs">Missing bank info</span>
                  )}
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  {new Date(item.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    item.status === 'paid' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
                    item.status === 'approved' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                    item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                    'bg-red-900/30 text-red-400 border-red-500/30'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {isQueue ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all"
                      onClick={() => markAsPaid(item.id)}
                      disabled={updatingId === item.id}
                    >
                      {updatingId === item.id ? 'Processing...' : 'MARK PAID'}
                    </Button>
                  ) : (
                     <span className="text-gray-600 text-xs italic">Archived</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No items found.
          </div>
        )}
      </div>
    </div>
  );

  if (loading && queueItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="mb-4 text-gray-400 hover:text-white pl-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Admin Payout Queue
            </h1>
            <p className="text-gray-400">Manage affiliate withdrawals</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={fetchData} className="border-gray-800 bg-gray-900 text-white hover:bg-gray-800">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" className="border-gray-800 bg-gray-900 text-white hover:bg-gray-800">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, email, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800 text-white focus:border-yellow-500/50 transition-colors w-full md:w-96"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="queue" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="queue" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <RefreshCw className="w-4 h-4 mr-2" /> Pending Queue ({queueItems.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-800">
              <History className="w-4 h-4 mr-2" /> History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="queue" className="mt-6">
            {renderTable(filteredQueue, true)}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            {renderTable(filteredHistory, false)}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default AdminWithdrawals;