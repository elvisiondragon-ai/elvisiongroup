import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Users, ShieldAlert, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = 'elvisiondragon@gmail.com';

const AdminWebinar = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this page.",
          variant: "destructive"
        });
        navigate('/');
      } else {
        fetchData();
      }
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: webinarData, error } = await supabase
        .from('user_webinar')
        .select('*')
        .order('paid_at', { ascending: false });

      if (error) throw error;
      setData(webinarData || []);
    } catch (err: any) {
      console.error('Error fetching admin webinar data:', err);
      toast({
        title: "Error",
        description: "Failed to load webinar data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (endsAt: string) => {
    if (!endsAt) return 'Unknown';
    return new Date() < new Date(endsAt) ? 'Active' : 'Expired';
  };

  const filteredData = data.map(item => ({
    ...item,
    displayStatus: getStatus(item.ends_at)
  })).filter(item => 
    item.email?.toLowerCase().includes(search.toLowerCase()) ||
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.order_id?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.email !== ADMIN_EMAIL) return null;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="text-primary" /> Webinar Admin
          </h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all webinar participants.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search email, name or order..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <ShieldAlert className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.filter(i => getStatus(i.ends_at) === 'Active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.filter(i => getStatus(i.ends_at) === 'Expired').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Participant</TableHead>
                  <TableHead className="font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Origin</TableHead>
                  <TableHead className="font-bold">Paid At</TableHead>
                  <TableHead className="font-bold">Ends At</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{row.name || 'No Name'}</span>
                          <span className="text-xs text-muted-foreground">{row.email}</span>
                          {row.phone_number && <span className="text-xs text-muted-foreground">{row.phone_number}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{row.order_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={row.origin === 'USA' ? 'border-blue-500 text-blue-500' : 'border-red-500 text-red-500'}>
                          {row.origin || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(row.paid_at)}</TableCell>
                      <TableCell className="text-sm">{formatDate(row.ends_at)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={row.displayStatus === 'Active' ? 'default' : 'destructive'}
                          className={row.displayStatus === 'Active' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          {row.displayStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWebinar;
