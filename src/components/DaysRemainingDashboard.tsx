import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface UserSubscriptionData {
  user_id: string;
  email: string;
  display_name: string;
  subscription_type: string;
  subscription_start_date: string;
  subscription_end_date: string;
  trial_start_date: string;
  trial_end_date: string;
  is_active: boolean;
  level: number;
  experience_points: number;
}

export function DaysRemainingDashboard() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<UserSubscriptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const searchUsers = async (email: string = '') => {
    try {
      setLoading(true);
      
      // Direct SQL query since the function might not be in types yet
      const { data, error } = await supabase
        .from('days_remaining')
        .select(`
          user_id,
          email,
          subscription_type,
          days_remaining,
          subscription_start_date,
          subscription_end_date,
          trial_start_date,
          trial_end_date,
          is_active,
          profiles!inner(display_name, level, experience_points)
        `)
        .ilike('email', `%${email}%`)
        .order('days_remaining', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      const transformedData: UserSubscriptionData[] = (data || []).map(item => ({
        user_id: item.user_id,
        email: item.email,
        display_name: (item.profiles as any)?.display_name || 'N/A',
        subscription_type: item.subscription_type,
        days_remaining: item.days_remaining,
        subscription_start_date: item.subscription_start_date,
        subscription_end_date: item.subscription_end_date,
        trial_start_date: item.trial_start_date,
        trial_end_date: item.trial_end_date,
        is_active: item.is_active,
        level: (item.profiles as any)?.level || 1,
        experience_points: (item.profiles as any)?.experience_points || 0
      }));

      setSearchResults(transformedData);
      
      if (transformedData.length === 0 && email) {
        toast({
          title: "No Results",
          description: `No users found with email containing "${email}"`,
          variant: "default"
        });
      }

    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: error.message || "Failed to search users",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchUsers(searchEmail);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filter and sort results
  const filteredResults = searchResults
    .filter(user => {
      if (filterType === 'all') return true;
      return user.subscription_type === filterType;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.days_remaining - b.days_remaining;
      }
      return b.days_remaining - a.days_remaining;
    });

  const exportToCSV = () => {
    if (filteredResults.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      'Email',
      'Display Name',
      'Subscription Type',
      'Days Remaining',
      'Level',
      'XP',
      'Start Date',
      'End Date',
      'Status'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredResults.map(user => [
        user.email,
        user.display_name || 'N/A',
        user.subscription_type,
        user.days_remaining,
        user.level,
        user.experience_points,
        user.subscription_start_date ? format(new Date(user.subscription_start_date), 'yyyy-MM-dd') : 'N/A',
        user.subscription_end_date ? format(new Date(user.subscription_end_date), 'yyyy-MM-dd') : 'N/A',
        user.is_active ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `subscription_data_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: `Exported ${filteredResults.length} records to CSV`,
    });
  };

  const syncData = async () => {
    try {
      setLoading(true);
      
      // Call the sync function through a direct SQL call
      const { data, error } = await supabase
        .rpc('sync_all_days_remaining');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Sync Complete",
        description: `Updated subscription records`,
      });

      // Refresh search results
      await searchUsers(searchEmail);

    } catch (error: any) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Error",
        description: error.message || "Failed to sync subscription data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionBadgeVariant = (type: string) => {
    switch (type) {
      case 'trial':
        return 'secondary';
      case '1_day':
      case '1_week':
      case '1_month':
      case '1_year':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 0) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  useEffect(() => {
    // Load initial data on component mount
    searchUsers();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Days Remaining Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Controls */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by email (leave empty to show all)"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={syncData} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="1_day">1 Day</SelectItem>
                <SelectItem value="1_week">1 Week</SelectItem>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="1_year">1 Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Days Remaining ↓</SelectItem>
                <SelectItem value="asc">Days Remaining ↑</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportToCSV} variant="outline" disabled={filteredResults.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Results Summary */}
          {searchResults.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredResults.length} of {searchResults.length} results
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table */}
      {filteredResults.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Level/XP</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.display_name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getSubscriptionBadgeVariant(user.subscription_type)}>
                          {user.subscription_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getDaysRemainingColor(user.days_remaining)}`}>
                          {user.days_remaining} days
                        </span>
                      </TableCell>
                      <TableCell>
                        Level {user.level} ({user.experience_points} XP)
                      </TableCell>
                      <TableCell>
                        {user.subscription_start_date 
                          ? format(new Date(user.subscription_start_date), 'MMM dd, yyyy')
                          : user.trial_start_date 
                          ? format(new Date(user.trial_start_date), 'MMM dd, yyyy')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {user.subscription_end_date 
                          ? format(new Date(user.subscription_end_date), 'MMM dd, yyyy')
                          : user.trial_end_date 
                          ? format(new Date(user.trial_end_date), 'MMM dd, yyyy')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results State */}
      {!loading && filteredResults.length === 0 && searchResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground">
              Search for users by email or click "Search" to load all subscription data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="text-center py-8">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading subscription data...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}