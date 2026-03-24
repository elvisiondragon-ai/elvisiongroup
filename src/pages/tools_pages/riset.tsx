import React, { useState } from 'react';
import { Search, TrendingUp, BookOpen, ShoppingBag, Globe, ArrowUpRight, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data based on 2025 trends
const googleTrendsData = [
  { keyword: "Self-Improvement 2025", growth: "+150%", volume: "High" },
  { keyword: "AI for Beginners", growth: "+300%", volume: "Very High" },
  { keyword: "Mental Health Guides", growth: "+80%", volume: "High" },
  { keyword: "Passive Income Strategies", growth: "+200%", volume: "High" },
  { keyword: "Gut Health & Probiotics", growth: "+120%", volume: "Medium" },
  { keyword: "Sustainable Living Tips", growth: "+90%", volume: "Medium" },
];

const etsyData = [
  { title: "Digital Planner 2025", category: "Productivity", sales: "10k+", price: "$15" },
  { title: "Wedding Planning Checklist", category: "Lifestyle", sales: "5k+", price: "$12" },
  { title: "Keto Meal Prep Guide", category: "Health", sales: "8k+", price: "$10" },
  { title: "Budget Tracker Excel", category: "Finance", sales: "15k+", price: "$8" },
  { title: "ADHD Focus Journal", category: "Mental Health", sales: "3k+", price: "$18" },
];

const udemyData = [
  { course: "Python for Data Science", students: "500k+", rating: 4.6 },
  { course: "Digital Marketing Masterclass", students: "300k+", rating: 4.5 },
  { course: "Complete Yoga Series", students: "100k+", rating: 4.8 },
  { course: "Financial Analysis 101", students: "200k+", rating: 4.4 },
  { course: "Copywriting Secrets", students: "150k+", rating: 4.7 },
];

const top20Ebooks = [
  { rank: 1, title: "The 2025 Digital Planner", niche: "Productivity", source: "Etsy/Amazon", demand: "Very High" },
  { rank: 2, title: "AI Tools for Productivity", niche: "Tech", source: "Google Trends", demand: "Explosive" },
  { rank: 3, title: "Keto Diet for Beginners", niche: "Health", source: "ClickBank", demand: "High" },
  { rank: 4, title: "Mastering Your Mindset", niche: "Self-Help", source: "Amazon", demand: "Evergreen" },
  { rank: 5, title: "Passive Income Playbook", niche: "Finance", source: "Udemy", demand: "High" },
  { rank: 6, title: "Anxiety Relief Workbook", niche: "Mental Health", source: "Etsy", demand: "High" },
  { rank: 7, title: "Wedding Budget Planner", niche: "Lifestyle", source: "Etsy", demand: "Seasonal High" },
  { rank: 8, title: "Python Programming Guide", niche: "Education", source: "Udemy", demand: "Steady" },
  { rank: 9, title: "Air Fryer Recipes 101", niche: "Food", source: "Google Trends", demand: "Medium" },
  { rank: 10, title: "Crypto Investing 2025", niche: "Finance", source: "Google Trends", demand: "Volatile High" },
  { rank: 11, title: "Minimalist Living Guide", niche: "Lifestyle", source: "Pinterest", demand: "Medium" },
  { rank: 12, title: "Social Media Marketing Strategy", niche: "Business", source: "Udemy", demand: "High" },
  { rank: 13, title: "Plant-Based Diet Plan", niche: "Health", source: "Amazon", demand: "Growing" },
  { rank: 14, title: "Excel Macros for Dummies", niche: "Skills", source: "Udemy", demand: "Steady" },
  { rank: 15, title: "Travel Hacking Guide", niche: "Travel", source: "Blogs", demand: "Recovering" },
  { rank: 16, title: "Container Gardening", niche: "Hobbies", source: "Amazon", demand: "Seasonal" },
  { rank: 17, title: "Dog Training Secrets", niche: "Pets", source: "ClickBank", demand: "Evergreen" },
  { rank: 18, title: "ChatGPT Prompt Engineering", niche: "Tech", source: "Gumroad", demand: "Very High" },
  { rank: 19, title: "Effective Communication Skills", niche: "Self-Help", source: "Udemy", demand: "High" },
  { rank: 20, title: "Intermittent Fasting Guide", niche: "Health", source: "Google Trends", demand: "High" },
];

const RisetPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate processing time
    setTimeout(() => {
      setSearchResult(searchTerm);
      setIsLoading(false);
    }, 800);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 font-sans bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              Ebook Market Research
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Analyze keyword demand across major platforms in real-time.
            </p>
          </div>
          <Button variant="outline" className="gap-2 border-purple-200 hover:bg-purple-50 text-purple-700">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>

        {/* Search Section */}
        <Card className="border-purple-100 dark:border-purple-900 shadow-lg border-2">
          <CardHeader>
             <CardTitle className="text-purple-900 dark:text-purple-100">Keyword Analysis</CardTitle>
             <CardDescription>Enter a topic to generate live market research links.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input 
                  placeholder="Enter niche or topic (e.g., 'Mediterranean Diet', 'Learn Python')..." 
                  className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading || !searchTerm} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px] shadow-md hover:shadow-lg transition-all">
                {isLoading ? "Generating..." : "Analyze"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Live Results Section */}
        {searchResult && (
          <div className="grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Google Trends Card */}
             <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 hover:shadow-xl transition-shadow border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" /> Google Trends
                  </CardTitle>
                  <CardDescription>Check search volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-gray-500 mb-4">
                     See if "{searchResult}" is trending up or down over the last 12 months.
                   </p>
                   <Button 
                    className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200" 
                    variant="outline"
                    onClick={() => openLink(`https://trends.google.com/trends/explore?q=${encodeURIComponent(searchResult)}`)}
                   >
                     View Trend Report <ArrowUpRight className="ml-2 h-4 w-4" />
                   </Button>
                </CardContent>
             </Card>

             {/* Etsy Card */}
             <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-pink-500 hover:shadow-xl transition-shadow border-pink-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-pink-500" /> Etsy Market
                  </CardTitle>
                  <CardDescription>Analyze competition & prices</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-gray-500 mb-4">
                     See best-selling digital products for "{searchResult}" to find gaps.
                   </p>
                   <Button 
                    className="w-full bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-200" 
                    variant="outline"
                    onClick={() => openLink(`https://www.etsy.com/search?q=${encodeURIComponent(searchResult)}&explicit=1&order=most_relevant&ref=search_bar`)}
                   >
                     View Competitors <ArrowUpRight className="ml-2 h-4 w-4" />
                   </Button>
                </CardContent>
             </Card>

             {/* Udemy Card */}
             <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-violet-500 hover:shadow-xl transition-shadow border-violet-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-violet-500" /> Udemy Courses
                  </CardTitle>
                  <CardDescription>Validate paying customers</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-gray-500 mb-4">
                     Check if people are paying to learn about "{searchResult}".
                   </p>
                   <Button 
                    className="w-full bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200" 
                    variant="outline"
                    onClick={() => openLink(`https://www.udemy.com/courses/search/?src=ukw&q=${encodeURIComponent(searchResult)}`)}
                   >
                     Check Course Demand <ArrowUpRight className="ml-2 h-4 w-4" />
                   </Button>
                </CardContent>
             </Card>
          </div>
        )}

        <div className="flex items-center gap-2 my-8">
           <div className="h-px bg-purple-200 flex-1"></div>
           <span className="text-sm text-purple-400 font-medium uppercase tracking-wider">2025 Market Insights (Static)</span>
           <div className="h-px bg-purple-200 flex-1"></div>
        </div>

        {/* Platform Analysis Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-purple-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">Overview</TabsTrigger>
            <TabsTrigger value="google" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">Google Trends</TabsTrigger>
            <TabsTrigger value="etsy" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">Etsy Best Sellers</TabsTrigger>
            <TabsTrigger value="udemy" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">Udemy Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Niche</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">AI & Tech</div>
                  <p className="text-xs text-muted-foreground">+300% growth YOY</p>
                </CardContent>
              </Card>
              <Card className="border-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Ebook Price</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-pink-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">$14.99</div>
                  <p className="text-xs text-muted-foreground">For non-fiction guides</p>
                </CardContent>
              </Card>
              <Card className="border-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Competition</CardTitle>
                  <Globe className="h-4 w-4 text-violet-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">High</div>
                  <p className="text-xs text-muted-foreground">Requires niche down</p>
                </CardContent>
              </Card>
               <Card className="border-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Format</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">PDF / ePub</div>
                  <p className="text-xs text-muted-foreground">Bundled with templates</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900">Top 20 High-Potential Ebooks to Sell</CardTitle>
                <CardDescription>Curated list based on cross-platform data analysis.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border border-purple-100">
                  <Table>
                    <TableHeader className="bg-purple-50">
                      <TableRow>
                        <TableHead className="w-[50px] text-purple-900">Rank</TableHead>
                        <TableHead className="text-purple-900">Title Idea</TableHead>
                        <TableHead className="text-purple-900">Niche</TableHead>
                        <TableHead className="text-purple-900">Primary Source</TableHead>
                        <TableHead className="text-right text-purple-900">Demand Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {top20Ebooks.map((ebook) => (
                        <TableRow key={ebook.rank} className="hover:bg-purple-50/50">
                          <TableCell className="font-medium text-purple-900">{ebook.rank}</TableCell>
                          <TableCell>{ebook.title}</TableCell>
                          <TableCell><Badge variant="outline" className="border-purple-200 text-purple-700">{ebook.niche}</Badge></TableCell>
                          <TableCell>{ebook.source}</TableCell>
                          <TableCell className="text-right">
                             <span className={`font-semibold ${ebook.demand.includes('High') || ebook.demand.includes('Explosive') ? 'text-green-600' : 'text-yellow-600'}`}>
                               {ebook.demand}
                             </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="google" className="space-y-4">
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900">Google Trends Insights</CardTitle>
                <CardDescription>Trending search queries over the last 90 days.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader className="bg-purple-50">
                      <TableRow>
                        <TableHead className="text-purple-900">Keyword</TableHead>
                        <TableHead className="text-purple-900">Growth</TableHead>
                        <TableHead className="text-purple-900">Search Volume</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {googleTrendsData.map((item, i) => (
                        <TableRow key={i} className="hover:bg-purple-50/50">
                          <TableCell className="font-medium">{item.keyword}</TableCell>
                          <TableCell className="text-green-600 font-bold">{item.growth}</TableCell>
                          <TableCell>{item.volume}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="etsy" className="space-y-4">
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900">Etsy Best Sellers</CardTitle>
                <CardDescription>Top performing digital products and downloads.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader className="bg-purple-50">
                      <TableRow>
                        <TableHead className="text-purple-900">Product Title</TableHead>
                        <TableHead className="text-purple-900">Category</TableHead>
                        <TableHead className="text-purple-900">Est. Sales</TableHead>
                        <TableHead className="text-purple-900">Avg. Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {etsyData.map((item, i) => (
                        <TableRow key={i} className="hover:bg-purple-50/50">
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.sales}</TableCell>
                          <TableCell>{item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="udemy" className="space-y-4">
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-900">Udemy Popular Courses</CardTitle>
                <CardDescription>Topics people are paying to learn (Great for Ebooks).</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader className="bg-purple-50">
                      <TableRow>
                        <TableHead className="text-purple-900">Course Topic</TableHead>
                        <TableHead className="text-purple-900">Students</TableHead>
                        <TableHead className="text-purple-900">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {udemyData.map((item, i) => (
                        <TableRow key={i} className="hover:bg-purple-50/50">
                          <TableCell className="font-medium">{item.course}</TableCell>
                          <TableCell>{item.students}</TableCell>
                          <TableCell>{item.rating} ⭐</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RisetPage;
