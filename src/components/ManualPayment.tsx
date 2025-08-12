import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, MessageCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface ManualPaymentProps {
  onClose: () => void;
}

export const ManualPayment: React.FC<ManualPaymentProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentDetails = {
    bankName: 'BCA',
    accountNumber: '7751146578',
    accountName: 'Delia',
    monthly: {
      amount: 100000,
      displayAmount: 'Rp 100.000'
    },
    yearly: {
      amount: 800000,
      displayAmount: 'Rp 800.000'
    }
  };

  const whatsappUrl = 'https://wa.me/62895325633487?text=Kak%20Renata%20saya%20sudah%20bayar%20ekosistem%20ini%20bukti%20transfernya';

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(paymentDetails.accountNumber);
    toast({
      title: t('common.copied'),
      description: 'Nomor rekening berhasil disalin',
    });
  };

  const handleCreateManualPayment = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'Anda harus login terlebih dahulu',
          variant: 'destructive',
        });
        return;
      }

      // Generate unique reference for manual payment
      const merchantRef = `MANUAL_${Date.now()}_${user.id.slice(0, 8)}`;
      const amount = selectedPlan === 'monthly' ? paymentDetails.monthly.amount : paymentDetails.yearly.amount;

      // Create a dummy subscription ID for the transaction
      const dummySubscriptionId = '00000000-0000-0000-0000-000000000000';

      // Create pending transaction record
      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          subscription_id: dummySubscriptionId,
          status: 'UNPAID',
          tripay_reference: merchantRef,
          tripay_merchant_ref: merchantRef,
          payment_method: 'BCA_MANUAL',
          amount: amount,
          payment_instructions: {
            bank_name: paymentDetails.bankName,
            account_number: paymentDetails.accountNumber,
            account_name: paymentDetails.accountName,
            amount: amount,
            subscription_type: selectedPlan,
            whatsapp_url: whatsappUrl
          }
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Berhasil',
        description: 'Instruksi pembayaran telah dibuat. Silakan lakukan transfer sesuai detail di bawah.',
      });
    } catch (error) {
      console.error('Error creating manual payment:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat instruksi pembayaran',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPlan = selectedPlan === 'monthly' ? paymentDetails.monthly : paymentDetails.yearly;

  return (
    <div className="max-h-[75vh] overflow-y-auto space-y-4">
      {/* Plan Selection */}
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className={`cursor-pointer transition-all ${
            selectedPlan === 'monthly' ? 'ring-2 ring-primary' : 'hover:shadow-md'
          }`}
          onClick={() => setSelectedPlan('monthly')}
        >
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-base">Bulanan</CardTitle>
            <div className="text-xl font-bold text-primary">Rp 100k</div>
            <CardDescription className="text-xs">per bulan</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant={selectedPlan === 'monthly' ? 'default' : 'secondary'}>
              Fleksibel
            </Badge>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            selectedPlan === 'yearly' ? 'ring-2 ring-primary' : 'hover:shadow-md'
          }`}
          onClick={() => setSelectedPlan('yearly')}
        >
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-base">Tahunan</CardTitle>
            <div className="text-xl font-bold text-primary">Rp 800k</div>
            <CardDescription className="text-xs">per tahun</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant={selectedPlan === 'yearly' ? 'default' : 'secondary'}>
              Hemat 33%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Instruksi Pembayaran Manual
          </CardTitle>
          <CardDescription>
            Transfer manual ke rekening BCA berikut
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Bank:</span>
              <span className="font-bold text-blue-600">{paymentDetails.bankName}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Rekening:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{paymentDetails.accountNumber}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAccountNumber}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Atas Nama:</span>
              <span className="font-bold">{paymentDetails.accountName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Transfer:</span>
              <span className="font-bold text-xl text-primary">{currentPlan.displayAmount}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-1 text-sm">Langkah:</h4>
            <ol className="text-xs text-amber-700 space-y-0.5 list-decimal list-inside">
              <li>Transfer {currentPlan.displayAmount}</li>
              <li>Simpan bukti transfer</li>
              <li>Klik "Pay Now" untuk konfirmasi</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            asChild
            className="flex-1 items-center gap-2"
          >
            <a href="https://wa.me/62895325633487?text=Kak%20Renata%20saya%20sudah%20bayar%20aplikasi%20ini%20bukti%20transfernya" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Pay Now
            </a>
          </Button>
          
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};