"use client";
import { useNavigate as useRouter } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { io } from "socket.io-client";
import { 
  ShoppingBag, 
  MessageSquare, 
  BookOpen, 
  Power, 
  Save, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  QrCode,
  Cpu,
  Send,
  UserCheck,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShopAuto() {
  const { user, userProfile, cleanupSupabase } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // AI Engine State
  const [aiProviderType, setAiProviderType] = useState<"system" | "custom">("system");
  const [aiEngine, setAiEngine] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [isAiTesting, setIsAiTesting] = useState(false);

  // Test Chat State
  const [testChatMessage, setTestChatMessage] = useState("");
  const [testChatHistory, setTestChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Shopee Connection State
  const [isShopeeConnected, setIsShopeeConnected] = useState(false);
  const [shopeStoreName, setShopeStoreName] = useState("");
  const [shopeShopId, setShopeShopId] = useState("");
  const [shopePartnerId, setShopePartnerId] = useState("");
  const [shopePartnerKey, setShopePartnerKey] = useState("");

  // Auto Chat & AI Settings
  const [autoChatEnabled, setAutoChatEnabled] = useState(false);
  const [autoOrderEnabled, setAutoOrderEnabled] = useState(false);
  
  // Knowledge Base State
  const [aiKnowledgeEssay, setAiKnowledgeEssay] = useState("");

  // WhatsApp Notification State
  const [whatsappDestination, setWhatsappDestination] = useState(""); 
  const [whatsappForwardEnabled, setWhatsappForwardEnabled] = useState(false);

  // Admin Identities
  const [waAdminType, setWaAdminType] = useState<"system" | "custom">("system");
  const [isWaConnected, setIsWaConnected] = useState(false);
  const [waAccount, setWaAccount] = useState("");
  
  // Real WhatsApp Connection State
  const [waQrCode, setWaQrCode] = useState<string | null>(null);
  const [waStatus, setWaStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [waBackendUrl, setWaBackendUrl] = useState("http://148.230.101.96:3000");
  const [isSendingWaTest, setIsSendingWaTest] = useState(false);
  const [testWaMessage, setTestWaMessage] = useState("");
  const [availableGroups, setAvailableGroups] = useState<{id: string, name: string, count?: number}[]>([]);
  const [isFetchingGroups, setIsFetchingGroups] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedRef = React.useRef(false);

  // --- SAVE LOGIC ---
  const saveSettings = async (overrides: any = {}, silent = true) => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const currentSettings = userProfile?.shopauto_settings || {};
      const finalApiKey = apiKey === "********" ? currentSettings.apiKey : apiKey;

      // Determine values, prioritizing overrides then local state
      const settings = {
        aiProviderType: overrides.aiProviderType ?? aiProviderType,
        aiEngine: overrides.aiEngine ?? aiEngine,
        apiKey: overrides.apiKey ?? finalApiKey,
        isShopeeConnected: overrides.isShopeeConnected ?? isShopeeConnected,
        shopeStoreName: overrides.shopeStoreName ?? shopeStoreName,
        shopeShopId: overrides.shopeShopId ?? shopeShopId,
        shopePartnerId: overrides.shopePartnerId ?? shopePartnerId,
        shopePartnerKey: overrides.shopePartnerKey ?? shopePartnerKey,
        autoChatEnabled: overrides.autoChatEnabled ?? autoChatEnabled,
        autoOrderEnabled: overrides.autoOrderEnabled ?? autoOrderEnabled,
        aiKnowledgeEssay: overrides.aiKnowledgeEssay ?? aiKnowledgeEssay,
        whatsappDestination: overrides.whatsappDestination ?? whatsappDestination,
        whatsappForwardEnabled: overrides.whatsappDestination !== undefined 
          ? !!overrides.whatsappDestination.trim() 
          : (whatsappDestination ? !!whatsappDestination.trim() : false),
        waAdminType: overrides.waAdminType ?? waAdminType,
        isWaConnected: overrides.isWaConnected ?? isWaConnected,
        waAccount: overrides.waAccount ?? waAccount,
        waBackendUrl: overrides.waBackendUrl ?? waBackendUrl,
      };

      const { error } = await supabase
        .from('profiles')
        .update({ shopauto_settings: settings } as any)
        .eq('user_id', user.id);

      if (error) throw error;
      if (!silent) toast({ title: "Berhasil", description: "Pengaturan telah disimpan ke Cloud." });
    } catch (err: any) {
      console.error("Save error:", err.message);
      toast({ title: "Error", description: "Gagal menyimpan: " + err.message, variant: "destructive" });
    } finally {
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  const handleToggle = (key: string, value: any) => {
    if (key === "autoChatEnabled") setAutoChatEnabled(value);
    if (key === "autoOrderEnabled") setAutoOrderEnabled(value);
    if (key === "aiProviderType") setAiProviderType(value);
    if (key === "aiEngine") setAiEngine(value);
    if (key === "waAdminType") setWaAdminType(value);
    
    // Pass the new value directly to saveSettings to avoid async state lag
    saveSettings({ [key]: value }, true);
  };

  // Auto-Save Debounce for text inputs
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    const timer = setTimeout(() => {
      if (user && !isSaving) saveSettings({}, true);
    }, 2000); 
    return () => clearTimeout(timer);
  }, [whatsappDestination, aiKnowledgeEssay, apiKey, waBackendUrl]);

  // --- WA LOGIC ---
  useEffect(() => {
    if (waAdminType !== "custom") return;

    const socket = io(waBackendUrl);

    socket.on("qr-user", (url) => {
      console.log("User QR Received via Socket");
      setWaQrCode(url);
      setWaStatus("connecting");
    });

    socket.on("status-user", (status) => {
      console.log("User Status Received via Socket:", status);
      if (status === "READY" || status === "AUTHENTICATED") {
        setIsWaConnected(true);
        setWaStatus("connected");
        setWaQrCode(null);
        if (status === "READY") handleToggle("isWaConnected", true);
      } else if (status === "QR_READY") {
        // Handled by the 'qr-user' event for speed
        setWaStatus("connecting");
      } else if (status === "INITIALIZING") {
        setIsWaConnected(false);
        // Optimized: Only hide QR if it's actually not there
        setWaQrCode(prev => {
          if (!prev) {
            setWaStatus("disconnected");
            return null;
          }
          return prev;
        });
      } else {
        // For any other status, only reset if we don't have a QR showing
        setWaQrCode(prev => {
          if (!prev) {
            setIsWaConnected(false);
            setWaStatus("disconnected");
          }
          return prev;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [waBackendUrl, waAdminType]);

  // Initial Status Check
  useEffect(() => {
    if (waAdminType !== "custom") return;
    
    const checkInitialStatus = async () => {
      try {
        const response = await fetch(waBackendUrl + "/status");
        const data = await response.json();
        const userStatus = data.user || { status: "INITIALIZING", qr: null };
        
        if (userStatus.status === "READY") {
          setIsWaConnected(true);
          setWaStatus("connected");
          setWaAccount(data.number || "Connected WA");
        } else if (userStatus.qr) {
          setWaQrCode(userStatus.qr);
          setWaStatus("connecting");
        }
      } catch (err) {
        console.error("Initial WA Status Error", err);
      }
    };
    
    checkInitialStatus();
  }, [waBackendUrl, waAdminType]);

  // --- FETCH SETTINGS ---
  useEffect(() => {
    if (!user || hasLoadedRef.current) {
      if (!user) setLoading(false);
      return;
    }

    if (userProfile?.shopauto_settings) {
      const settings = userProfile.shopauto_settings;
      setAiProviderType(settings.aiProviderType || "system");
      setAiEngine(settings.aiEngine || "openai");
      setApiKey(settings.apiKey ? "********" : "");
      setIsShopeeConnected(settings.isShopeeConnected || false);
      setShopeStoreName(settings.shopeStoreName || "");
      setShopeShopId(settings.shopeShopId || "");
      setShopePartnerId(settings.shopePartnerId || "");
      setShopePartnerKey(settings.shopePartnerKey || "");
      setAutoChatEnabled(settings.autoChatEnabled || false);
      setAutoOrderEnabled(settings.autoOrderEnabled || false);
      setAiKnowledgeEssay(settings.aiKnowledgeEssay || "");
      setWhatsappDestination(settings.whatsappDestination || "");
      setWhatsappForwardEnabled(settings.whatsappForwardEnabled || false);
      setWaAdminType(settings.waAdminType || "system");
      setIsWaConnected(settings.isWaConnected || false);
      setWaAccount(settings.waAccount || "");
      
      // Auto-migrate localhost to VPS IP
      const savedUrl = settings.waBackendUrl;
      const finalUrl = (savedUrl === "http://localhost:3000" || savedUrl === "http://localhost:8080" || !savedUrl) 
        ? "http://148.230.101.96:3000" 
        : savedUrl;
      
      setWaBackendUrl(finalUrl);
      hasLoadedRef.current = true;
    }
    setLoading(false);
  }, [user, userProfile]);

  // --- ACTIONS ---
  const handleTestChat = async () => {
    let realKey = apiKey === "********" ? userProfile?.shopauto_settings?.apiKey : apiKey;
    
    if (aiProviderType === "system") {
      toast({ title: "Secure Mode", description: "System AI is managed via Cloud. Key is hidden for safety." });
      // In production, this should call a Supabase Edge Function that has the key stored in secrets.
      return;
    }

    if (!realKey) {
      toast({ title: "Error", description: "Masukkan API Key terlebih dahulu.", variant: "destructive" });
      return;
    }
    if (!testChatMessage.trim()) return;
    const userMsg = testChatMessage;
    setTestChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setTestChatMessage("");
    setIsSendingTest(true);
    try {
      const prompt = `You are a Shopee Sales Assistant.\nKnowledge Base: ${aiKnowledgeEssay || "Answer helpfully."}\nUser: ${userMsg}\nAssistant:`;
      const currentEngine = (aiProviderType as any) === "system" ? "openai" : aiEngine;
      let aiResponse = "";
      if (currentEngine === "openai") {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${realKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }] })
        });
        const data = await resp.json();
        aiResponse = data.choices?.[0]?.message?.content || "No response.";
      } else {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${realKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await resp.json();
        aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      }
      setTestChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (err: any) {
      toast({ title: "Chat Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSendingTest(false);
    }
  };

  const testAiConnection = async () => {
    let realKey = apiKey === "********" ? userProfile?.shopauto_settings?.apiKey : apiKey;
    if (!realKey) {
      toast({ title: "Error", description: "Masukkan API Key terlebih dahulu.", variant: "destructive" });
      return;
    }

    setIsAiTesting(true);
    try {
      const currentEngine = aiEngine;
      if (currentEngine === "openai") {
        const resp = await fetch("https://api.openai.com/v1/models", {
          headers: { "Authorization": `Bearer ${realKey}` }
        });
        if (resp.ok) toast({ title: "Sukses", description: "Koneksi OpenAI berhasil!" });
        else throw new Error("API Key tidak valid");
      } else {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${realKey}`);
        if (resp.ok) toast({ title: "Sukses", description: "Koneksi Gemini berhasil!" });
        else throw new Error("API Key tidak valid");
      }
    } catch (err: any) {
      toast({ title: "Koneksi Gagal", description: err.message, variant: "destructive" });
    } finally {
      setIsAiTesting(false);
    }
  };

  const handleTestWaMessage = async () => {
    if (!whatsappDestination) {
      toast({ title: "Error", description: "Tentukan nomor tujuan atau ID grup WA.", variant: "destructive" });
      return;
    }
    setIsSendingWaTest(true);
    const testText = testWaMessage.trim() || "🚀 *ShopAuto Test Message*\n\nWhatsApp Forwarding berhasil terhubung!";
    
    console.log("DEBUG: Sending Test WA", { 
      type: waAdminType, 
      dest: whatsappDestination, 
      url: waBackendUrl,
      message: testText 
    });

    try {
      const targetUrl = `${waBackendUrl.replace(/\/$/, '')}/send-message`;
      
      const payload: any = { 
        number: whatsappDestination, 
        message: testText 
      };
      
      if (waAdminType === "system") {
        payload.sender = "admin";
      }

      const resp = await fetch(targetUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await resp.json();
      if (data.success) {
        toast({ title: "Berhasil terkirim" });
      } else {
        throw new Error(data.error || "Gagal mengirim via VPS.");
      }
    } catch (err: any) {
      console.error("DEBUG: WA Test Failed", err);
      toast({ title: "WA Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSendingWaTest(false);
    }
  };

  const fetchAvailableGroups = async () => {
    if (!waBackendUrl) {
      toast({ title: "Error", description: "WA Backend URL belum diset.", variant: "destructive" });
      return;
    }
    
    setIsFetchingGroups(true);
    try {
      // Direct fetch to VPS as per latest architecture
      const resp = await fetch(`${waBackendUrl.replace(/\/$/, '')}/groups`);
      if (!resp.ok) throw new Error("Gagal mengambil data grup dari VPS.");
      const data = await resp.json();
      setAvailableGroups(data);
      if (data.length === 0) {
        toast({ title: "Informasi", description: "Tidak ada grup yang ditemukan." });
      }
    } catch (err: any) {
      console.error("Fetch Groups Error:", err);
      toast({ title: "Error", description: "Gagal memuat grup: " + err.message, variant: "destructive" });
    } finally {
      setIsFetchingGroups(false);
    }
  };

  const connectShopee = () => {
    window.open("https://partner.shopeemobile.com/api/v1/shop/auth_partner", "_blank");
    setIsShopeeConnected(true);
    setShopeStoreName("My Store");
    setShopeShopId("12345678");
    saveSettings({ isShopeeConnected: true, shopeStoreName: "My Store", shopeShopId: "12345678" });
  };

  const scanIdentity = (type: string) => {
    if (type === 'wa') {
      setWaStatus("connecting");
      setWaQrCode(null);
    }
  };

  const disconnectWa = async () => {
    try {
      await fetch(waBackendUrl + "/disconnect", { 
        method: 'POST'
      });
      setIsWaConnected(false); setWaStatus("disconnected"); setWaAccount(""); setWaQrCode(null);
      handleToggle("isWaConnected", false);
    } catch (err) { console.error(err); }
  };

  const onLogout = async () => { 
    try { 
      await cleanupSupabase();
      await supabase.auth.signOut(); 
      router('/'); 
    } catch (err) { 
      console.error(err); 
    } 
  };

  if (!user) return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white"><Button onClick={() => router('/auth')}>Login</Button></div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20 font-sans">
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent tracking-tighter italic">ShopAuto AI</h1>
              <p className="text-gray-400 mt-1">Real-time AI Automation Ecosystem</p>
            </div>
            {isSaving ? (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                <RefreshCw size={12} className="mr-2" /> SAVING
              </Badge>
            ) : (autoChatEnabled || autoOrderEnabled) ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 size={12} className="mr-2" /> SYNCED
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                <Power size={12} className="mr-2" /> DISCONNECTED
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => saveSettings({}, false)} className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20"><Save className="w-4 h-4 mr-2" /> Simpan Cloud</Button>
            <Button variant="destructive" onClick={onLogout} className="bg-red-600/20 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-white transition-all"><Power className="w-4 h-4 mr-2" /> Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 p-1 mb-8 h-auto flex-wrap">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-orange-600">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-engine" className="data-[state=active]:bg-orange-600">AI Engine</TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-orange-600">Knowledge Base</TabsTrigger>
            <TabsTrigger value="forward" className="data-[state=active]:bg-orange-600">Nomor Gudang</TabsTrigger>
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-6 outline-none">
            <Card className="bg-gradient-to-br from-orange-600/20 to-black border-orange-500/30 text-white">
              <CardHeader><CardTitle className="text-2xl flex items-center gap-2 font-bold"><Zap className="text-orange-500 fill-orange-500" /> Kenapa ShopAuto AI?</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed text-gray-200 italic font-bold">"Kami berfokus hanya ke 2 hal saja: Kecepatan dan Presisi."</p>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p className="leading-relaxed"><span className="text-orange-400 font-bold">1. Respon Chat Customer:</span> Ingin balasan custom sesuai produk? Kami menyediakan AI yang canggih. Cukup tulis semua pengetahuan tiap produk.</p>
                  <p className="leading-relaxed"><span className="text-orange-400 font-bold">2. Order Capture:</span> Sering pesanan batal karena lupa ada orderan? AI kami akan capture orderan dari toko Anda dan post ke gudang/supplier Anda di WhatsApp. Tidak ada pesanan batal karena lupa proses lagi!</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2"><ShoppingBag size={14} className="text-orange-500" /> Shopee Status</CardTitle></CardHeader>
                <CardContent>{isShopeeConnected ? <div className="flex items-center justify-between"><span className="font-bold">{shopeStoreName}</span><Badge className="bg-green-500">CONNECTED</Badge></div> : <Button onClick={connectShopee} variant="outline" size="sm" className="w-full border-orange-500/50 text-orange-500 hover:bg-orange-500 hover:text-white">Connect Store</Button>}</CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2"><Cpu size={14} className="text-purple-500" /> AI Auto Chat</CardTitle></CardHeader>
                <CardContent><div className="flex items-center justify-between"><span className="font-bold">{aiProviderType.toUpperCase()}</span><Badge variant="outline" className={autoChatEnabled ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}>{autoChatEnabled ? "ON" : "OFF"}</Badge></div></CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2"><Smartphone size={14} className="text-green-500" /> Order Capture</CardTitle></CardHeader>
                <CardContent><div className="flex items-center justify-between"><span className="font-bold truncate max-w-[100px]">{whatsappDestination || "Not Set"}</span><Badge variant="outline" className={autoOrderEnabled ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}>{autoOrderEnabled ? "ON" : "OFF"}</Badge></div></CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader><CardTitle className="flex items-center gap-2 text-blue-400 font-bold"><ExternalLink size={18} /> Integration Setup</CardTitle><CardDescription className="text-gray-400">Salin URL di bawah ini ke Shopee Seller Centre &gt; Webhook Settings.</CardDescription></CardHeader>
              <CardContent><div className="space-y-2"><Label className="text-xs text-gray-500 uppercase font-bold">Webhook Push URL</Label><div className="flex gap-2"><Input readOnly value="https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/shopauto-handler" className="bg-black border-gray-700 text-xs font-mono text-blue-400" /><Button variant="outline" size="icon" className="hover:bg-blue-500" onClick={() => {navigator.clipboard.writeText("https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/shopauto-handler"); toast({title: "Copied"});}}><Copy size={14} /></Button></div></div></CardContent>
            </Card>
          </TabsContent>

          {/* AI ENGINE TAB */}
          <TabsContent value="ai-engine" className="space-y-6 outline-none">
            <Card className="bg-gray-900 border-gray-800 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="font-bold text-xl">Otomatisasi Chat</CardTitle>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-800 mt-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${autoChatEnabled ? 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-gray-800 text-gray-500'}`}><MessageSquare size={20} /></div>
                    <div><p className="font-bold">Aktifkan Auto Chat AI</p><p className="text-xs text-gray-400">AI akan secara cerdas membalas chat pembeli berdasarkan esai anda.</p></div>
                  </div>
                  <Switch checked={autoChatEnabled} onCheckedChange={(v) => handleToggle("autoChatEnabled", v)} />
                </div>
              </CardHeader>
              <CardContent className={`space-y-6 transition-all duration-500 ${!autoChatEnabled ? "opacity-20 pointer-events-none blur-[1px]" : "opacity-100"}`}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-400">PILIH PROVIDER AI</Label>
                    <Select value={aiProviderType} onValueChange={(v: any) => handleToggle("aiProviderType", v)}>
                      <SelectTrigger className="bg-black border-gray-700 h-12 text-lg"><SelectValue placeholder="Pilih Provider" /></SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        <SelectItem value="system">API Kami (FREE)</SelectItem>
                        <SelectItem value="custom">API Kamu (Gunakan Key Sendiri)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {aiProviderType === "system" ? (
                    <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><Zap className="text-purple-400 fill-purple-400" /><p className="font-bold text-purple-100 text-lg">Server API Kami (FREE)</p></div>
                        <Badge className="bg-green-500 px-3 py-1">ACTIVE</Badge>
                      </div>
                      <p className="text-sm text-purple-200 leading-relaxed text-gray-300">Sistem menggunakan infrastruktur eL Vision Group dengan OpenAI High-Speed secara gratis untuk anda. Tidak ada kuota terbatas.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 border-t border-gray-800 pt-6 mt-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Engine & API Key</Label>
                        <Select value={aiEngine} onValueChange={(v) => handleToggle("aiEngine", v)}>
                          <SelectTrigger className="bg-black border-gray-700 h-12"><SelectValue placeholder="Pilih Engine" /></SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800 text-white">
                            <SelectItem value="openai">OpenAI (GPT-4o / mini)</SelectItem>
                            <SelectItem value="gemini">Gemini 2.5 Flash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Input type="password" placeholder="Masukkan API Key Anda" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="bg-black border-gray-700 h-12" />
                        <Button onClick={testAiConnection} disabled={isAiTesting} variant="outline" className="border-purple-500 text-purple-500 h-12 px-6 hover:bg-purple-500 hover:text-white transition-all">{isAiTesting ? <RefreshCw className="animate-spin w-4 h-4" /> : "Test Connection"}</Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button onClick={() => saveSettings({}, false)} className="w-full bg-purple-600 hover:bg-purple-700 h-12 font-bold text-lg shadow-lg shadow-purple-600/20 mt-4"><Save className="w-5 h-5 mr-2" /> Simpan AI Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KNOWLEDGE TAB */}
          <TabsContent value="knowledge" className="space-y-6 outline-none">
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader><CardTitle className="flex items-center gap-2 text-orange-400 font-bold text-xl"><BookOpen /> AI Knowledge (The Essay)</CardTitle><CardDescription className="text-gray-400">Jelaskan segalanya tentang toko anda di sini. AI akan mempelajari esai ini untuk menjawab pelanggan secara natural.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <Textarea placeholder="Contoh: Toko saya menjual sepatu sport original. Kami buka jam 8 pagi - 9 malam. Jika stok habis, tawarkan model lain yang serupa. Ongkir Jakarta flat 10rb..." value={aiKnowledgeEssay} onChange={(e) => setAiKnowledgeEssay(e.target.value)} className="bg-black border-gray-700 min-h-[400px] leading-relaxed text-lg focus:ring-orange-500/50" />
                <Button onClick={() => saveSettings({}, false)} className="w-full bg-orange-600 hover:bg-orange-700 h-12 font-bold text-lg shadow-lg shadow-orange-600/20"><Save className="w-5 h-5 mr-2" /> Simpan AI Knowledge</Button>
                
                {/* TEST CHAT AREA */}
                <div className="mt-12 space-y-4 border-t border-gray-800 pt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-green-400"><MessageSquare size={20} /> TEST CHAT WITH AI</h3>
                    <Button variant="ghost" size="sm" onClick={() => setTestChatHistory([])} className="text-[10px] uppercase font-bold text-gray-500">Reset Chat</Button>
                  </div>
                  <div className="bg-black/60 rounded-2xl border border-gray-800 p-6 min-h-[300px] max-h-[450px] overflow-y-auto space-y-4 shadow-inner">
                    {testChatHistory.length === 0 && <div className="flex flex-col items-center justify-center h-full opacity-30 mt-20"><MessageSquare size={48} className="mb-2" /><p className="font-medium">Belum ada percakapan. Sapa AI anda!</p></div>}
                    {testChatHistory.map((chat, i) => (
                      <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${chat.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'}`}><p className="text-sm leading-relaxed">{chat.content}</p></div>
                      </div>
                    ))}
                    {isSendingTest && <div className="flex justify-start"><div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none flex gap-1"><div className="w-2 h-2 bg-gray-500 rounded-full"></div><div className="w-2 h-2 bg-gray-500 rounded-full"></div><div className="w-2 h-2 bg-gray-500 rounded-full"></div></div></div>}
                  </div>
                  <div className="flex gap-2 bg-black p-2 rounded-2xl border border-gray-800 shadow-xl focus-within:border-orange-500/50 transition-all">
                    <Input placeholder="Tanya seputar toko anda ke AI..." value={testChatMessage} onChange={(e) => setTestChatMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleTestChat()} className="bg-transparent border-none h-12 focus-visible:ring-0 text-lg" />
                    <Button onClick={handleTestChat} disabled={isSendingTest} className="bg-green-600 hover:bg-green-700 h-12 w-12 rounded-xl shrink-0"><Send size={20} /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FORWARD TAB */}
          <TabsContent value="forward" className="space-y-6 outline-none">
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-800 mb-4 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${autoOrderEnabled ? 'bg-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-gray-800 text-gray-500'}`}><ShoppingBag size={20} /></div>
                    <div><p className="font-bold">Aktifkan Auto Order Capture</p><p className="text-xs text-gray-400 italic">Capture detail order Shopee (Resi, Kurir, Produk) ke WhatsApp.</p></div>
                  </div>
                  <Switch checked={autoOrderEnabled} onCheckedChange={(v) => handleToggle("autoOrderEnabled", v)} />
                </div>
              </CardHeader>
              <CardContent className={`space-y-6 transition-all duration-500 ${!autoOrderEnabled ? "opacity-20 pointer-events-none blur-[1px]" : "opacity-100"}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2"><Label className="text-sm font-bold text-gray-400 uppercase tracking-widest">TUJUAN GUDANG / SUPPLIER</Label><Button variant="link" size="sm" onClick={fetchAvailableGroups} disabled={isFetchingGroups} className="text-orange-400 p-0 h-auto font-bold text-xs hover:text-orange-300">{isFetchingGroups ? <RefreshCw className="animate-spin mr-2" size={12} /> : null}CARI ID GRUP SAYA</Button></div>
                  <div className="flex gap-2">
                    <Input placeholder="Contoh: 628... atau 12345678@g.us" value={whatsappDestination} onChange={(e) => setWhatsappDestination(e.target.value)} className="bg-black border-gray-700 h-14 text-2xl font-bold text-green-400 tracking-tight text-center" />
                    <Button variant="outline" size="icon" className="h-14 w-14 hover:bg-gray-800" onClick={() => {navigator.clipboard.writeText(whatsappDestination); toast({title: "Copied"});}}><Copy size={24} /></Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center italic">Tip: Gunakan "Cari ID Grup" untuk mendapatkan ID grup gudang anda secara otomatis.</p>
                  <Button onClick={() => saveSettings({}, false)} className="w-full bg-green-600 hover:bg-green-700 h-14 font-bold text-lg shadow-lg shadow-green-600/20 mt-2"><Save className="w-5 h-5 mr-2" /> Simpan Nomor Gudang</Button>
                </div>
                {availableGroups.length > 0 && (
                  <div className="bg-black/60 border border-gray-800 rounded-2xl p-4 space-y-3 max-h-[250px] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2"><p className="text-xs font-bold text-orange-400 uppercase">Grup Ditemukan</p><Button variant="ghost" size="sm" onClick={() => setAvailableGroups([])} className="h-6 text-[10px] hover:bg-red-500/10 hover:text-red-500">Tutup</Button></div>
                    {availableGroups.map(g => (
                      <div key={g.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all group/item">
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold truncate group-hover/item:text-orange-400">{g.name}</p>
                            {g.count !== undefined && (
                              <Badge variant="outline" className="text-[9px] h-4 px-1 bg-orange-500/10 text-orange-500 border-orange-500/20 leading-none">
                                {g.count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 font-mono truncate">{g.id}</p>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => {setWhatsappDestination(g.id); setAvailableGroups([]); toast({title: "Grup Dipilih"});}} className="h-8 px-4 font-bold bg-orange-600/10 text-orange-500 border border-orange-600/20 hover:bg-orange-600 hover:text-white transition-all">Pilih</Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 pt-6 border-t border-gray-800">
                  <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Admin WhatsApp Identity</Label>
                  <Select value={waAdminType} onValueChange={(v: any) => handleToggle("waAdminType", v)}>
                    <SelectTrigger className="bg-black border-gray-700 h-14 text-lg font-bold"><SelectValue placeholder="Pilih Provider" /></SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                      <SelectItem value="system">Admin Kami (FREE)</SelectItem>
                      <SelectItem value="custom">Admin Anda (100rb/Bulan)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {waAdminType === "system" ? (
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><CheckCircle2 className="text-blue-400" /><p className="font-bold text-blue-100">Infrastruktur eL Vision</p></div>
                        <Badge className="bg-green-500 text-[10px]">GRATIS</Badge>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">AI akan menggunakan nomor official kami untuk mengirim detail order ke Gudang anda secara otomatis.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-orange-500 shrink-0 mt-1" size={16} />
                        <div><p className="text-xs text-orange-200 font-bold">Premium Branding</p><p className="text-[10px] text-orange-300/70">Hubungkan nomor pribadi anda agar nama toko anda muncul di WhatsApp Gudang.</p></div>
                      </div>
                      
                      {isWaConnected ? (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3"><div className="p-2 bg-green-500 rounded-full"><Smartphone className="text-white" size={18} /></div><div><p className="font-bold text-sm">{waAccount}</p><p className="text-[10px] text-green-400 font-bold uppercase">Ready</p></div></div>
                          <Button variant="ghost" size="sm" className="text-red-400 text-xs" onClick={disconnectWa}>Putuskan</Button>
                        </div>
                      ) : waQrCode ? (
                        <div className="flex flex-col items-center py-6 border-2 border-dashed border-orange-500/30 rounded-2xl bg-black/40 space-y-4">
                          <div className="bg-white p-2 rounded-xl"><img src={waQrCode} alt="QR" className="w-40 h-40" /></div>
                          <p className="text-sm text-gray-300 font-medium">Scan with WhatsApp</p>
                          <Button variant="outline" size="sm" className="text-gray-500 text-[10px]" onClick={() => { setWaQrCode(null); setWaStatus("disconnected"); }}>Reset</Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-6 border-2 border-dashed border-orange-500/30 rounded-2xl bg-black/40 space-y-4">
                          <div className="flex flex-col items-center gap-2"><RefreshCw className="text-orange-500 animate-spin" size={24} /><p className="text-xs text-gray-400">Menghubungkan ke WhatsApp VPS...</p></div>
                          <Button variant="outline" size="sm" className="text-gray-500 text-[10px]" onClick={() => setWaStatus("connecting")}>Retry</Button>
                        </div>
                      )}
                    </div>
                  )}
                  <Button onClick={() => saveSettings({}, false)} className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-12 shadow-lg shadow-blue-600/20 mt-2"><Save className="w-4 h-4 mr-2" /> Simpan Konfigurasi Admin</Button>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-800">
                  <Label className="text-xs font-bold text-gray-500 uppercase">Test Message (Optional)</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Tulis pesan test di sini..." 
                      value={testWaMessage} 
                      onChange={(e) => setTestWaMessage(e.target.value)} 
                      className="bg-black border-gray-700 h-14"
                    />
                    <Button onClick={handleTestWaMessage} disabled={isSendingWaTest} variant="outline" className="border-green-500 text-green-500 h-14 px-8 hover:bg-green-500 hover:text-white transition-all">{isSendingWaTest ? <RefreshCw className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5 mr-2" />} Test Kirim</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
