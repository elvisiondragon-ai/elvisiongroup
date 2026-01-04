import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  QrCode, 
  MessageCircle, 
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  Clock,
  Phone,
  Settings,
  Download,
  Upload
} from "lucide-react";

const WhatsAppDashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // disconnected, connecting, connected
  const [qrCode, setQrCode] = useState("");
  const [phoneNumber] = useState("+62895325633487");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientNumber, setRecipientNumber] = useState("");
  const [stats, setStats] = useState({
    totalMessages: 0,
    messagesSent: 0,
    messagesReceived: 0,
    activeChats: 0
  });

  // Simulate QR code generation
  const generateQRCode = () => {
    setConnectionStatus("connecting");
    // In real implementation, this would call your backend API
    setTimeout(() => {
      // Simulating QR code data
      setQrCode("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=whatsapp-web-session-" + Date.now());
    }, 1000);
  };

  // Simulate connection
  const simulateConnection = () => {
    setTimeout(() => {
      setConnectionStatus("connected");
      setQrCode("");
      // Simulate some initial data
      setStats({
        totalMessages: 145,
        messagesSent: 89,
        messagesReceived: 56,
        activeChats: 12
      });
    }, 3000);
  };

  useEffect(() => {
    if (qrCode && connectionStatus === "connecting") {
      simulateConnection();
    }
  }, [qrCode]);

  const handleConnect = () => {
    generateQRCode();
  };

  const handleDisconnect = () => {
    setConnectionStatus("disconnected");
    setQrCode("");
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && recipientNumber.trim()) {
      const message = {
        id: Date.now(),
        to: recipientNumber,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        status: "sent"
      };
      setMessages([message, ...messages]);
      setNewMessage("");
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        messagesSent: prev.messagesSent + 1
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={40} />
              <div>
                <h1 className="text-3xl font-bold">WhatsApp Web.js Dashboard</h1>
                <p className="text-emerald-100">Kelola WhatsApp Business Anda</p>
              </div>
            </div>
            <Badge className={`px-4 py-2 text-lg ${
              connectionStatus === "connected" ? "bg-green-500" :
              connectionStatus === "connecting" ? "bg-yellow-500" :
              "bg-red-500"
            }`}>
              {connectionStatus === "connected" ? "🟢 Terhubung" :
               connectionStatus === "connecting" ? "🟡 Menghubungkan..." :
               "🔴 Terputus"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Connection & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connection Card */}
            <Card className="border-2 border-emerald-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone size={20} className="text-emerald-600" />
                  Koneksi WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Nomor WhatsApp</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={phoneNumber} disabled className="bg-gray-50" />
                  </div>
                </div>

                {connectionStatus === "disconnected" && (
                  <Button 
                    onClick={handleConnect}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    <QrCode className="mr-2" size={18} />
                    Hubungkan WhatsApp
                  </Button>
                )}

                {connectionStatus === "connecting" && qrCode && (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">Scan QR Code dengan WhatsApp Anda</p>
                    <div className="bg-white p-4 rounded-lg border-2 border-emerald-200">
                      <img src={qrCode} alt="QR Code" className="w-full h-auto" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-yellow-600">
                      <RefreshCw className="animate-spin" size={16} />
                      <span className="text-sm">Menunggu scan...</span>
                    </div>
                  </div>
                )}

                {connectionStatus === "connected" && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="text-green-600 mx-auto mb-2" size={32} />
                      <p className="text-green-700 font-semibold">Terhubung!</p>
                      <p className="text-sm text-green-600">WhatsApp siap digunakan</p>
                    </div>
                    <Button 
                      onClick={handleDisconnect}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="mr-2" size={18} />
                      Putuskan Koneksi
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="text-xs text-gray-500 space-y-1">
                  <p>💡 <strong>Cara menggunakan:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Klik "Hubungkan WhatsApp"</li>
                    <li>Scan QR Code dengan WhatsApp</li>
                    <li>Tunggu hingga terhubung</li>
                    <li>Mulai kirim pesan!</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            {connectionStatus === "connected" && (
              <Card className="border-2 border-emerald-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} className="text-emerald-600" />
                    Statistik
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">{stats.totalMessages}</div>
                    <div className="text-sm text-gray-600">Total Pesan</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{stats.messagesSent}</div>
                      <div className="text-xs text-gray-600">Terkirim</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">{stats.messagesReceived}</div>
                      <div className="text-xs text-gray-600">Diterima</div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.activeChats}</div>
                    <div className="text-sm text-gray-600">Chat Aktif</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Messaging */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-emerald-100 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send size={20} className="text-emerald-600" />
                  Kirim Pesan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectionStatus !== "connected" ? (
                  <div className="text-center py-12">
                    <MessageCircle className="text-gray-300 mx-auto mb-4" size={64} />
                    <p className="text-gray-500 text-lg">Hubungkan WhatsApp terlebih dahulu</p>
                    <p className="text-sm text-gray-400 mt-2">Scan QR Code untuk mulai mengirim pesan</p>
                  </div>
                ) : (
                  <>
                    {/* Send Message Form */}
                    <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-emerald-100">
                      <div>
                        <Label htmlFor="recipient">Nomor Penerima</Label>
                        <Input
                          id="recipient"
                          placeholder="628123456789"
                          value={recipientNumber}
                          onChange={(e) => setRecipientNumber(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: 628xxx (tanpa +)</p>
                      </div>

                      <div>
                        <Label htmlFor="message">Pesan</Label>
                        <textarea
                          id="message"
                          placeholder="Tulis pesan Anda di sini..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[120px]"
                        />
                      </div>

                      <Button
                        onClick={handleSendMessage}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        disabled={!newMessage.trim() || !recipientNumber.trim()}
                      >
                        <Send className="mr-2" size={18} />
                        Kirim Pesan
                      </Button>
                    </div>

                    <Separator />

                    {/* Message History */}
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Clock size={18} />
                        Riwayat Pesan
                      </h3>
                      
                      {messages.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <p>Belum ada pesan terkirim</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {messages.map((msg) => (
                            <div key={msg.id} className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    Ke: {msg.to}
                                  </Badge>
                                  <Badge className="text-xs bg-green-100 text-green-700">
                                    <CheckCircle size={12} className="mr-1" />
                                    {msg.status}
                                  </Badge>
                                </div>
                                <span className="text-xs text-gray-500">{msg.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-700">{msg.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-emerald-100 shadow-lg hover:scale-105 transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Kirim Pesan Massal</h3>
              <p className="text-sm text-gray-600">Kirim pesan ke banyak kontak sekaligus dengan mudah</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-100 shadow-lg hover:scale-105 transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Auto Reply</h3>
              <p className="text-sm text-gray-600">Balas pesan otomatis untuk pelanggan Anda</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-100 shadow-lg hover:scale-105 transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Export Data</h3>
              <p className="text-sm text-gray-600">Download riwayat chat dan laporan statistik</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3 text-blue-700">ℹ️ Informasi Penting</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Dashboard ini menggunakan WhatsApp Web.js API resmi</li>
              <li>✅ QR Code berlaku selama 60 detik, scan secepatnya</li>
              <li>✅ Koneksi akan tetap aktif selama browser terbuka</li>
              <li>✅ Pastikan nomor WhatsApp Anda aktif dan tidak di-banned</li>
              <li>⚠️ Jangan gunakan untuk spam, ikuti kebijakan WhatsApp</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;