
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface IncomeData {
  product_name: string;
  quantity_sold: number;
  total_paid: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const IncomeDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<'all' | '30d'>('30d');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchIncomeData = async () => {
      setLoading(true);
      setError(null);

      const procedure = timeRange === '30d' ? 'get_income_last_30_days' : 'get_income_all_time';

      // We should create Supabase RPC functions for security and efficiency.
      // For now, let's build the query here and recommend creating functions later.
      
      let productQuery = supabase
        .from('global_product')
        .select('product_name, amount')
        .eq('status', 'PAID');

      if (timeRange === '30d') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        productQuery = productQuery.gte('created_at', thirtyDaysAgo.toISOString());
      }
      
      const { data, error: queryError } = await productQuery;

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      const aggregatedData = data.reduce((acc, item) => {
        if (!acc[item.product_name]) {
          acc[item.product_name] = { product_name: item.product_name, quantity_sold: 0, total_paid: 0 };
        }
        acc[item.product_name].quantity_sold += 1;
        acc[item.product_name].total_paid += item.amount;
        return acc;
      }, {} as { [key: string]: IncomeData });

      const sortedData = Object.values(aggregatedData).sort((a, b) => a.product_name.localeCompare(b.product_name));
      const grandTotal = sortedData.reduce((sum, item) => sum + item.total_paid, 0);

      setIncomeData(sortedData);
      setTotalIncome(grandTotal);
      setLoading(false);
    };

    fetchIncomeData();
  }, [timeRange, isAdmin]);

  const handleTimeRangeChange = (value: 'all' | '30d') => {
    setTimeRange(value);
  };
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view this page. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Income Dashboard</h1>
        <Select onValueChange={handleTimeRangeChange} value={timeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
         <Alert variant="destructive" className="mb-4">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Fetching Data</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Quantity Sold</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeData.map((item) => (
                  <TableRow key={item.product_name}>
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell className="text-right">{item.quantity_sold} pcs</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.total_paid)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
           <CardHeader>
             <CardTitle className="text-lg">Total Income</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-4xl font-bold tracking-tight">{formatCurrency(totalIncome)}</p>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncomeDashboard;
