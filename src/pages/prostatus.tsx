import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Payment } from '@/pages/Payment';
import { ArrowLeft } from 'lucide-react';

export default function ProUpgradePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Pro Membership</h1>
        </div>
        <ProUpgrade onClose={() => navigate('/')} onNavigate={(path) => navigate(path)} />
      </div>
    </div>
  );
}
