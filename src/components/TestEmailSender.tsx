import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const TestEmailSender = () => {
  const [email, setEmail] = useState('srcindocs@gmail.com');
  const [emailType, setEmailType] = useState<'payment_created' | 'payment_completed'>('payment_created');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendTest = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-payment-email', {
        body: {
          email,
          type: emailType
        }
      });

      if (error) throw error;

      toast.success(`Test ${emailType} email sent to ${email}!`);
      console.log('Email sent:', data);
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Payment Emails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Email Type</label>
          <Select value={emailType} onValueChange={(value: 'payment_created' | 'payment_completed') => setEmailType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment_created">Payment Created (Waiting)</SelectItem>
              <SelectItem value="payment_completed">Payment Completed (Success)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSendTest}
          disabled={isLoading || !email}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Test Email'}
        </Button>
      </CardContent>
    </Card>
  );
};