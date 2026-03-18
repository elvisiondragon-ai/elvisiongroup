"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCcw, Search } from "lucide-react";

export default function Pixels() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const PAGE_SIZE = 50;

  const PIXEL_NAMES: Record<string, string> = {
    '1393383179182528': 'USA KAYA PIXEL',
    '1797660474333865': 'Fit Factor PIXEL',
    '3319324491540889': 'GENESIS200 PIXEL'
  };

  const lastLogElementRef = useCallback((node: HTMLTableRowElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchLogs = async (currentPage: number, search: string, isRefresh = false) => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from('pixel_events')
        .select('*')
        .in('event_name', ['Purchase', 'Test_Purchase', 'AddToCart', 'AddPaymentInfo'])
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

      if (search) {
          query = query.or(`event_name.ilike.%${search}%,user_data->>email.ilike.%${search}%,event_id.ilike.%${search}%,custom_data->>tripay_reference.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching pixel logs:', error);
      } else {
        if (isRefresh || currentPage === 0) {
          setLogs(data || []);
        } else {
          setLogs(prev => [...prev, ...(data || [])]);
        }
        setHasMore((data?.length || 0) === PAGE_SIZE);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchLogs(0, searchTerm, true);
  }, [searchTerm]);

  useEffect(() => {
    if (page > 0) {
      fetchLogs(page, searchTerm);
    }
  }, [page]);

  useEffect(() => {
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
          const allowedEvents = ['Purchase', 'Test_Purchase', 'AddToCart', 'AddPaymentInfo'];
          if (allowedEvents.includes(payload.new.event_name)) {
            setLogs((current) => [payload.new, ...current]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRefresh = () => {
    setPage(0);
    fetchLogs(0, searchTerm, true);
  };

  return (
    <div className="container mx-auto py-10 space-y-8 min-h-screen flex flex-col font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 sticky top-0 z-50 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pixel Logs eL Vision Group</h1>
        <div className="flex flex-1 w-full md:max-w-md gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                    placeholder="Search Ref, Email, Event..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-100 border-slate-300 focus:bg-white text-slate-900 transition-colors font-medium placeholder:text-slate-500"
                />
            </div>
            <Button 
              onClick={handleRefresh} 
              size="icon" 
              title="Refresh" 
              className="bg-white hover:bg-white text-slate-900 border border-slate-300 shadow-sm active:scale-95 transition-transform"
            >
             {loading ? <Loader2 className="h-4 w-4 animate-spin text-slate-900" /> : <RefreshCcw className="h-4 w-4 text-slate-900" />}
            </Button>
        </div>
      </div>

      <Card className="flex-1 border-slate-200 shadow-lg bg-white">
        <CardContent className="p-0">
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="hover:bg-slate-900/90">
                  <TableHead className="w-[180px] text-slate-200 font-bold">Time</TableHead>
                  <TableHead className="w-[150px] text-slate-200 font-bold">Ref / Event</TableHead>
                  <TableHead className="text-slate-200 font-bold">Pixel / Status</TableHead>
                  <TableHead className="text-slate-200 font-bold">User Data</TableHead>
                  <TableHead className="text-slate-200 font-bold">Event Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {logs.map((log, index) => {
                  const isLastElement = logs.length === index + 1;
                  return (
                    <TableRow 
                        key={log.id + index} 
                        ref={isLastElement ? lastLogElementRef : null}
                        className="hover:bg-slate-50 transition-colors border-b border-slate-100"
                    >
                      <TableCell className="align-top">
                        <div className="font-medium text-xs text-slate-500">
                            {new Date(log.created_at).toLocaleDateString()}
                        </div>
                        <div className="font-bold text-sm text-slate-900">
                            {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="font-extrabold text-black truncate max-w-[200px]" title={log.event_name}>
                            {log.event_name}
                        </div>
                        {log.event_id && (
                             <div className="mt-1 flex items-center gap-1">
                                <Badge variant="outline" className="font-mono text-[10px] truncate max-w-[150px] bg-slate-100 text-slate-800 border-slate-300 font-bold" title="Tripay Reference / Event ID">
                                    {log.event_id}
                                </Badge>
                             </div>
                        )}
                      </TableCell>

                      <TableCell className="align-top">
                         <div className="flex flex-col gap-1">
                            <Badge className={`w-fit font-bold ${log.status === 'sent' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                {log.status}
                            </Badge>
                            <span className="text-[10px] text-slate-600 font-mono font-semibold" title={log.pixel_id}>
                                {PIXEL_NAMES[log.pixel_id] ? (
                                    <span className="text-indigo-900">{PIXEL_NAMES[log.pixel_id]}</span>
                                ) : log.pixel_id}
                            </span>
                         </div>
                      </TableCell>

                      <TableCell className="align-top max-w-[250px]">
                        <div className="space-y-1 text-xs">
                            {log.user_data?.email && (
                                <div className="flex items-center gap-1 text-slate-900 font-medium truncate" title={log.user_data.email}>
                                    <span className="font-bold text-slate-400">@</span> {log.user_data.email}
                                </div>
                            )}
                            {log.user_data?.fbc && (
                                <div className="font-mono text-[10px] text-slate-500 truncate" title={`FBC: ${log.user_data.fbc}`}>
                                    FBC: {log.user_data.fbc}
                                </div>
                            )}
                             {log.user_data?.fbp && (
                                <div className="font-mono text-[10px] text-slate-500 truncate" title={`FBP: ${log.user_data.fbp}`}>
                                    FBP: {log.user_data.fbp}
                                </div>
                            )}
                        </div>
                      </TableCell>

                      <TableCell className="align-top">
                         <div className="text-xs space-y-2">
                             {/* Product Info from Custom Data */}
                             {log.custom_data && (
                                 <div className="bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[10px] text-slate-800 max-h-[100px] overflow-auto">
                                     {Object.entries(log.custom_data).map(([key, val]: [string, any]) => (
                                         <div key={key} className="truncate">
                                             <span className="font-bold text-slate-500">{key}:</span> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                         </div>
                                     ))}
                                 </div>
                             )}
                             
                             {/* Page URL */}
                             {log.page_url && (
                                 <div className="text-[10px] text-blue-600 font-semibold truncate max-w-[300px]" title={log.page_url}>
                                     {log.page_url}
                                 </div>
                             )}
                         </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {logs.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                      No events found matching your search.
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-900" />
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
}