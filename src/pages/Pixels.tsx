import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCcw } from "lucide-react";
import { JsonView } from '@/components/ui/json-view'; // Assuming you might have one, or I'll use pre

export default function Pixels() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchInput] = useState('');

  const fetchLogs = async (search?: string) => {
    setLoading(true);
    let query = supabase
      .from('pixel_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (search) {
        // Simple search logic for Email, FBP or FBC inside JSONB or columns
        query = query.or(`user_data->>email.ilike.%${search}%,user_data->>fbp.ilike.%${search}%,user_data->>fbc.ilike.%${search}%,pixel_id.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pixel logs:', error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(searchTerm);
    // ... realtime remains same
  }, [searchTerm]);
    
  useEffect(() => {
    // Subscribe to realtime updates
    const channel = supabase
      .channel('pixel_events_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pixel_events',
        },
        (payload) => {
          setLogs((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Pixel Event Logs</h1>
        <div className="flex flex-1 max-w-sm gap-2">
            <Input 
                placeholder="Search Email, FBP, or FBC..." 
                value={searchTerm}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-white"
            />
        </div>
        <Button onClick={() => fetchLogs(searchTerm)} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events (Realtime)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Pixel ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>FBC (Ad Click)</TableHead>
                <TableHead>FBP (Browser)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URL / Product</TableHead>
                <TableHead>Meta Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{log.event_name}</TableCell>
                  <TableCell>{log.pixel_id}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={log.user_data?.email}>
                    {log.user_data?.email || '-'}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate font-mono text-[10px]" title={log.user_data?.fbc}>
                    {log.user_data?.fbc || '-'}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate font-mono text-[10px]" title={log.user_data?.fbp}>
                    {log.user_data?.fbp || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'sent' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    <div className="text-xs">
                        {log.custom_data ? (
                            <pre className="overflow-auto whitespace-pre-wrap font-mono">
                                {JSON.stringify(log.custom_data, null, 2)}
                            </pre>
                        ) : 'No custom data'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                     <div className="text-xs text-gray-500 truncate">
                        {log.meta_response ? JSON.stringify(log.meta_response) : '-'}
                     </div>
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                    No pixel events found. Trigger some events to see them here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
