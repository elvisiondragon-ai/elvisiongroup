"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Payment } from '@/views/Payment';
import { ArrowLeft } from 'lucide-react';
import { ProUpgrade } from '@/components/ProUpgrade';

export default function ProUpgradePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Pro Membership</h1>
        </div>
        <ProUpgrade onClose={() => router.push('/')} onNavigate={(path) => router.push(path)} />
      </div>
    </div>
  );
}
