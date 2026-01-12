import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Trash2, 
  Filter, 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  Youtube, 
  Instagram, 
  Video, 
  Loader2,
  PlayCircle,
  Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

// Types
type Platform = 'all' | 'tiktok' | 'instagram' | 'youtube';
type TimeRange = '1m' | '3m' | 'all';

interface Account {
  id: string;
  username: string;
  platform: Platform;
  avatarUrl?: string;
}

interface ContentItem {
  id: string;
  accountId: string;
  username: string;
  platform: Platform;
  thumbnailUrl: string;
  title: string;
  views: number;
  likes: number;
  shares: number;
  uploadedAt: string;
  viralScore: number;
}

const WatchlistPage = () => {
  const { toast } = useToast();
  
  // State
  const [newAccount, setNewAccount] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tiktok'); // Default for adding
  const [filterPlatform, setFilterPlatform] = useState<Platform>('all');
  const [timeFilter, setTimeFilter] = useState<TimeRange>('3m');
  const [useDemoMode, setUseDemoMode] = useState(false); // Toggle for demo mode
  const [watchlist, setWatchlist] = useState<Account[]>([
    { id: '1', username: 'alexhormozi', platform: 'instagram' },
    { id: '2', username: 'mrbeast', platform: 'youtube' },
    { id: '3', username: 'khaby.lame', platform: 'tiktok' },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Helper: Format numbers (e.g., 1.2M)
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Helper: Get Icon for Platform
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'youtube': return <Youtube className="w-4 h-4 text-red-600" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'tiktok': return <Video className="w-4 h-4 text-black dark:text-white" />; // Using Video icon for TikTok as generic
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  // Helper: Generate Mock Data
  const generateMockData = (account: Account): ContentItem[] => {
    const mockItems: ContentItem[] = [];
    const numPosts = Math.floor(Math.random() * 3) + 3;
    
    const titles = [
      `How I grew my ${account.platform} account 🚀`,
      `The secret to viral content in 2026`,
      `Stop doing this on ${account.platform}! 🛑`,
      `My daily routine as a creator`,
      `This changed my life forever...`,
      `Unbelievable results with this strategy`,
      `POV: You actually tried this hack`,
      `Why ${account.username} is taking over`
    ];

    for (let i = 0; i < numPosts; i++) {
      const views = Math.floor(Math.random() * 5000000) + 100000;
      const likes = Math.floor(views * (Math.random() * 0.1 + 0.05));
      const shares = Math.floor(likes * (Math.random() * 0.2 + 0.05));
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];

      mockItems.push({
        id: `${account.id}-${i}`,
        accountId: account.id,
        username: account.username,
        platform: account.platform,
        thumbnailUrl: `https://ui-avatars.com/api/?name=${account.username}&background=random&color=fff&size=400&font-size=0.33&length=1`,
        title: randomTitle,
        views,
        likes,
        shares,
        uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
        viralScore: (views + likes * 2 + shares * 5) / 1000
      });
    }
    return mockItems;
  };

  // Action: Add Account
  const handleAddAccount = () => {
    if (!newAccount.trim()) return;
    
    // Check duplicates
    if (watchlist.some(a => a.username.toLowerCase() === newAccount.toLowerCase() && a.platform === selectedPlatform)) {
      toast({
        title: "Account already exists",
        description: `${newAccount} is already in your watchlist.`,
        variant: "destructive"
      });
      return;
    }

    const account: Account = {
      id: Date.now().toString(),
      username: newAccount.trim(),
      platform: selectedPlatform,
    };

    setWatchlist([...watchlist, account]);
    setNewAccount('');
    toast({
      title: "Account Added",
      description: `Added ${account.username} to your watchlist.`
    });
  };

  // Action: Remove Account
  const handleRemoveAccount = (id: string) => {
    setWatchlist(watchlist.filter(a => a.id !== id));
  };

  // Action: Find Content (Real API Integration with Fallback)
  const handleFindContent = async () => {
    if (watchlist.length === 0) {
      toast({
        title: "Watchlist is empty",
        description: "Add some accounts to analyze first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setHasSearched(true);
    setResults([]);

    const RAPID_API_KEY = 'a2fdbd9663msh342f1a25c27383ep14e00ejsn1323bcd10e54';
    const allResults: ContentItem[] = [];
    let apiErrorOccurred = false;

    // Simulate delay if using demo mode immediately
    if (useDemoMode) {
       await new Promise(resolve => setTimeout(resolve, 1500));
       watchlist.forEach(account => {
         if (filterPlatform !== 'all' && account.platform !== filterPlatform) return;
         allResults.push(...generateMockData(account));
       });
       // Sort and Set
       allResults.sort((a, b) => b.viralScore - a.viralScore);
       setResults(allResults);
       setIsAnalyzing(false);
       toast({ title: "Analysis Complete (Demo Mode)", description: "Generated simulated viral content." });
       return;
    }

    try {
      for (const account of watchlist) {
        // Skip if filtered out by platform
        if (filterPlatform !== 'all' && account.platform !== filterPlatform) continue;

        let apiResults: any[] = [];
        let errorStatus = 0;

        if (account.platform === 'tiktok') {
          try {
            const response = await fetch(`https://tiktok-scraper7.p.rapidapi.com/user/posts?unique_id=${account.username}`, {
              headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com' }
            });

            if (!response.ok) {
              errorStatus = response.status;
              throw new Error(`TikTok API Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.data?.videos) {
              apiResults = data.data.videos.map((v: any) => ({
                id: v.video_id,
                accountId: account.id,
                username: account.username,
                platform: 'tiktok' as const,
                thumbnailUrl: v.cover,
                title: v.title || "TikTok Video",
                views: v.play_count || 0,
                likes: v.digg_count || 0,
                shares: v.share_count || 0,
                uploadedAt: new Date(v.create_time * 1000).toLocaleDateString(),
                viralScore: ((v.play_count || 0) + (v.digg_count || 0) * 2 + (v.share_count || 0) * 5) / 1000
              }));
            }
          } catch (e) { 
             console.error(`TikTok fetch failed for ${account.username}:`, e);
             apiErrorOccurred = true;
             // Fallback for this specific account
             apiResults = generateMockData(account);
             
             if (errorStatus === 429) {
               toast({ title: "Rate Limit Exceeded (TikTok)", description: "Daily limit reached. Switching to demo data for TikTok.", variant: "destructive" });
             } else if (errorStatus === 403) {
               toast({ title: "Access Forbidden (TikTok)", description: "Invalid API key or subscription. Switching to demo data.", variant: "destructive" });
             }
          }
        } else if (account.platform === 'instagram') {
          try {
            const response = await fetch(`https://instagram-scraper-stable-api.p.rapidapi.com/get_user_posts.php?username=${account.username}`, {
              headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com' }
            });
            
            if (!response.ok) {
              errorStatus = response.status;
              throw new Error(`Instagram API Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.data?.items) {
              apiResults = data.data.items.map((v: any) => ({
                id: v.id,
                accountId: account.id,
                username: account.username,
                platform: 'instagram' as const,
                thumbnailUrl: v.thumbnail_url || v.display_url,
                title: v.caption?.text || "Instagram Post",
                views: v.video_view_count || v.play_count || 0,
                likes: v.like_count || 0,
                shares: v.share_count || 0,
                uploadedAt: new Date(v.taken_at * 1000).toLocaleDateString(),
                viralScore: (((v.video_view_count || v.play_count || 0)) + (v.like_count || 0) * 2) / 1000
              }));
            }
          } catch (e) { 
            console.error(`Instagram fetch failed for ${account.username}:`, e);
            apiErrorOccurred = true;
             // Fallback for this specific account
            apiResults = generateMockData(account);

            if (errorStatus === 404) {
               toast({ title: "User Not Found (IG)", description: `Could not find @${account.username}. Showing simulated data.`, variant: "destructive" });
            } else if (errorStatus === 429) {
               toast({ title: "Rate Limit Exceeded (IG)", description: "API limit reached. Switching to demo data.", variant: "destructive" });
            }
          }
        }
        
        // Add whatever results we got (real or fallback)
        allResults.push(...apiResults);
        
        // Add a small delay between requests to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Sort all by viral score
      allResults.sort((a, b) => b.viralScore - a.viralScore);
      setResults(allResults);

      if (apiErrorOccurred) {
        toast({
          title: "Partial Analysis Completed",
          description: "Some real data failed to load, so we filled in with demo data.",
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${watchlist.length} accounts.`
        });
      }

    } catch (error) {
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6"
      >
        <div>
          <h1 className="text-3xl font-bold font-exo tracking-tight flex items-center gap-2">
            <TrendingUp className="text-primary h-8 w-8" />
            Viral Outlier Finder
          </h1>
          <p className="text-muted-foreground mt-1">
            Track competitors, find viral gaps, and replicate success.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="px-3 py-1">
              {watchlist.length} Accounts Watched
           </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Controls & Watchlist */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          {/* Add Account Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add to Watchlist</CardTitle>
              <CardDescription>Enter a username to track their content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedPlatform} onValueChange={(val: Platform) => setSelectedPlatform(val)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Username..." 
                  value={newAccount} 
                  onChange={(e) => setNewAccount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()}
                />
              </div>
              <Button onClick={handleAddAccount} className="w-full gap-2">
                <Plus className="w-4 h-4" /> Add Account
              </Button>
            </CardContent>
          </Card>

          {/* Watchlist Card */}
          <Card className="flex flex-col h-[500px]">
             <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Your Watchlist</CardTitle>
                <Badge variant="secondary">{watchlist.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
               <ScrollArea className="h-full px-6">
                  {watchlist.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      No accounts added yet.
                    </div>
                  ) : (
                    <div className="space-y-3 pb-4 pt-1">
                      {watchlist.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-muted">
                              {getPlatformIcon(account.platform)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">@{account.username}</p>
                              <p className="text-xs text-muted-foreground capitalize">{account.platform}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveAccount(account.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
               </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Content: Analysis & Results */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-2 w-full md:w-auto">
                 <Filter className="w-4 h-4 text-muted-foreground" />
                 <span className="text-sm font-medium mr-2">Filters:</span>
                 
                 <Tabs value={filterPlatform} onValueChange={(v) => setFilterPlatform(v as Platform)} className="w-auto">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="tiktok"><Video className="w-3 h-3 mr-1"/> TikTok</TabsTrigger>
                      <TabsTrigger value="instagram"><Instagram className="w-3 h-3 mr-1"/> IG</TabsTrigger>
                      <TabsTrigger value="youtube"><Youtube className="w-3 h-3 mr-1"/> YT</TabsTrigger>
                    </TabsList>
                 </Tabs>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="flex items-center gap-2 mr-2">
                    <label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground">Demo Mode</label>
                    <input 
                      id="demo-mode"
                      type="checkbox" 
                      className="toggle toggle-primary h-4 w-8 cursor-pointer appearance-none rounded-full bg-input checked:bg-primary relative transition-colors duration-200"
                      checked={useDemoMode}
                      onChange={(e) => setUseDemoMode(e.target.checked)}
                      style={{
                        backgroundImage: `radial-gradient(circle, white 40%, transparent 45%)`,
                        backgroundPosition: useDemoMode ? '100% center' : '0% center',
                        backgroundSize: '16px 16px',
                        backgroundRepeat: 'no-repeat',
                        transition: 'background-position 0.2s ease-in-out, background-color 0.2s'
                      }}
                    />
                 </div>

                 <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeRange)}>
                  <SelectTrigger className="w-[140px]">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">Last Month</SelectItem>
                    <SelectItem value="3m">Last 3 Months</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleFindContent} 
                  disabled={isAnalyzing || watchlist.length === 0}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white min-w-[140px] shadow-lg shadow-indigo-500/20"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Search className="w-4 h-4 mr-2" /> Find Content</>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Area */}
          <div className="space-y-4">
             {!hasSearched && (
               <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground">
                  <TrendingUp className="w-16 h-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-medium mb-2">Ready to find outliers</h3>
                  <p className="text-center max-w-md px-4">
                    Add competitor accounts to your watchlist and click "Find Content" to uncover their highest performing posts from {timeFilter === 'all' ? 'all time' : timeFilter === '1m' ? 'the last month' : 'the last 3 months'}.
                  </p>
               </div>
             )}

             {hasSearched && !isAnalyzing && results.length === 0 && (
               <div className="text-center py-20 text-muted-foreground">
                 No content found matching your filters.
               </div>
             )}

             {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer border-l-4 border-l-primary/50">
                        <div className="flex h-full">
                          {/* Left: Thumbnail Placeholder */}
                          <div className="w-1/3 bg-muted relative overflow-hidden">
                             <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors z-10">
                                <PlayCircle className="w-10 h-10 text-white opacity-80" />
                             </div>
                             <img 
                                src={item.thumbnailUrl} 
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.username}&background=random&color=fff&size=400`;
                                }}
                             />
                          </div>
                          
                          {/* Right: Content Details */}
                          <div className="w-2/3 p-4 flex flex-col justify-between">
                             <div>
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                      {getPlatformIcon(item.platform)}
                                      @{item.username}
                                   </div>
                                   <Badge variant={index < 3 ? "default" : "secondary"} className="text-[10px] h-5">
                                      #{index + 1} Outlier
                                   </Badge>
                                </div>
                                <h3 className="font-semibold text-sm line-clamp-2 mb-3 leading-snug group-hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                             </div>
                             
                             <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                                <div className="text-center">
                                   <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                                      <Eye className="w-3 h-3" />
                                   </div>
                                   <span className="text-sm font-bold block">{formatNumber(item.views)}</span>
                                </div>
                                <div className="text-center border-l border-r">
                                   <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                                      <Heart className="w-3 h-3" />
                                   </div>
                                   <span className="text-sm font-bold block">{formatNumber(item.likes)}</span>
                                </div>
                                <div className="text-center">
                                   <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                                      <Share2 className="w-3 h-3" />
                                   </div>
                                   <span className="text-sm font-bold block">{formatNumber(item.shares)}</span>
                                </div>
                             </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
