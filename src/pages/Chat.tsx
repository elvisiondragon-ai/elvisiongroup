import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { Send, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useXPSystem } from "@/hooks/useXPSystem";

interface ChatMessageData {
  id: string;
  user_id: string;
  user_name: string;
  user_level: number;
  is_vip: boolean;
  message: string;
  created_at: string;
}

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const { awardXP } = useXPSystem();

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Auth session:', session);
        
        if (session?.user) {
          // Get user profile for level info
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          console.log('User profile:', profile, 'Error:', profileError);
          
          // If no profile exists, create one
          if (!profile && !profileError) {
            console.log('Creating profile for user:', session.user.id);
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                user_id: session.user.id,
                display_name: session.user.email?.split('@')[0] || 'Anonymous',
                level: 1,
                experience_points: 0,
                total_sessions: 0,
                streak_days: 0
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              console.log('Profile created:', newProfile);
            }
          }
          
          const currentUserObj = {
            id: session.user.id, // Always use session user ID
            name: profile?.display_name || session.user.email?.split('@')[0] || 'Anonymous',
            level: profile?.level || 1,
            isVip: (profile?.level || 1) >= 5 // VIP if level 5 or higher
          };
          
          console.log('Setting currentUser:', currentUserObj);
          setCurrentUser(currentUserObj);
        } else {
          console.log('No authenticated user found');
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive"
        });
      }
    };

    getCurrentUser();
  }, [toast]);

  useEffect(() => {
    // Load messages from database
    const loadMessages = async () => {
      const { data: chatMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        // If no messages in database, use mock data as fallback
        const mockMessages: ChatMessageData[] = [
          { id: '1', user_id: '1', user_name: 'Budiyas32', user_level: 3, is_vip: false, message: 'asik banget apknya', created_at: new Date('2024-01-20T09:15:00').toISOString() },
          { id: '2', user_id: '2', user_name: 'dudungsubang', user_level: 2, is_vip: false, message: 'bener lebih mudah denger audionya ada historynya lagi', created_at: new Date('2024-01-20T09:16:00').toISOString() },
          { id: '3', user_id: '3', user_name: 'andiniwati', user_level: 2, is_vip: false, message: 'iya jadi betah diam di aplikasi', created_at: new Date('2024-01-20T09:16:30').toISOString() },
          { id: '4', user_id: '4', user_name: 'Jason', user_level: 3, is_vip: true, message: 'wah iya nih ada sistem game juga', created_at: new Date('2024-01-20T09:18:00').toISOString() },
          { id: '5', user_id: '5', user_name: 'Andin', user_level: 9, is_vip: false, message: 'bener mas anto, seru ngejar poinnya hehe', created_at: new Date('2024-01-20T09:18:30').toISOString() },
          { id: '6', user_id: '6', user_name: 'Master Yoga', user_level: 8, is_vip: false, message: 'Peringkatku naik terus nih, jadi semangat', created_at: new Date('2024-01-20T09:19:00').toISOString() },
          { id: '7', user_id: '7', user_name: 'SitiAisyah', user_level: 2, is_vip: false, message: 'fitur history itu yg paling ngebantu aku sih', created_at: new Date('2024-01-20T09:22:00').toISOString() },
          { id: '8', user_id: '8', user_name: 'EkoPrasetyo', user_level: 2, is_vip: false, message: 'setuju, ga perlu cari ulang audio yg kemarin didengerin', created_at: new Date('2024-01-20T09:22:30').toISOString() },
          { id: '9', user_id: '9', user_name: 'IwanSetiawan', user_level: 2, is_vip: false, message: 'Tampilannya juga bersih, ga ribet, enak diliat', created_at: new Date('2024-01-20T09:25:00').toISOString() },
          { id: '10', user_id: '10', user_name: 'DewiLestari90', user_level: 1, is_vip: false, message: 'baru download kemarin, langsung sukaa', created_at: new Date('2024-01-20T09:30:00').toISOString() },
          { id: '11', user_id: '11', user_name: 'Bambang_P', user_level: 3, is_vip: false, message: 'selamat datang mba dewi, dijamin nagih wkwk', created_at: new Date('2024-01-20T10:15:00').toISOString() },
          { id: '12', user_id: '12', user_name: 'PutriAyu', user_level: 2, is_vip: false, message: 'notifikasinya juga ga ganggu, pas banget timingnya', created_at: new Date('2024-01-20T10:17:00').toISOString() },
          { id: '13', user_id: '13', user_name: 'JokoWibowo88', user_level: 2, is_vip: false, message: 'Betul, ngingetin pas ada konten baru aja', created_at: new Date('2024-01-20T10:17:30').toISOString() },
          { id: '14', user_id: '14', user_name: 'HendraGunawan', user_level: 4, is_vip: true, message: 'eh ada yg udah dapet badge \'Master\' belum?', created_at: new Date('2024-01-20T10:20:00').toISOString() },
          { id: '15', user_id: '15', user_name: 'RatuAisyah', user_level: 3, is_vip: false, message: 'aku baru dapet yg \'Expert\', susah bgt yg master', created_at: new Date('2024-01-20T10:21:00').toISOString() },
          { id: '16', user_id: '16', user_name: 'SuryaAdi', user_level: 4, is_vip: true, message: 'Master harus selesain 100 audio tanpa skip kalo gasalah', created_at: new Date('2024-01-20T10:21:30').toISOString() },
          { id: '17', user_id: '17', user_name: 'HeruSantoso', user_level: 2, is_vip: false, message: 'wih mantap, kejar ah', created_at: new Date('2024-01-20T10:22:00').toISOString() },
          { id: '18', user_id: '18', user_name: 'LindaWati', user_level: 3, is_vip: false, message: 'Suka bgt sama playlistnya, bisa bikin sendiri', created_at: new Date('2024-01-20T11:40:00').toISOString() },
          { id: '19', user_id: '19', user_name: 'AhmadZaini', user_level: 3, is_vip: false, message: 'iyaa, aku kelompokin per topik jadi gampang belajarnya', created_at: new Date('2024-01-20T11:41:00').toISOString() },
          { id: '20', user_id: '20', user_name: 'CitraKirana', user_level: 3, is_vip: false, message: 'Adminnya juga responsif, kemarin aku lapor bug cepet ditanggepin', created_at: new Date('2024-01-20T11:45:00').toISOString() },
          { id: '21', user_id: '21', user_name: 'UjangTea', user_level: 1, is_vip: false, message: 'dua jempol buat developernya', created_at: new Date('2024-01-20T11:46:00').toISOString() },
          { id: '22', user_id: '22', user_name: 'MegaChan', user_level: 2, is_vip: false, message: 'Kualitas audionya jernih, pake headset makin mantap', created_at: new Date('2024-01-20T11:48:00').toISOString() },
          { id: '23', user_id: '23', user_name: 'FirmanHakim', user_level: 1, is_vip: false, message: 'bener, ga pecah suaranya', created_at: new Date('2024-01-20T11:48:30').toISOString() },
          { id: '24', user_id: '24', user_name: 'Sari_Love', user_level: 2, is_vip: false, message: 'aku malah suka dengerin sambil masak, jadi ga bosen', created_at: new Date('2024-01-20T11:50:00').toISOString() },
          { id: '25', user_id: '25', user_name: 'WawanKurniawan', user_level: 1, is_vip: false, message: 'ide bagus tuh mba sari, patut dicoba', created_at: new Date('2024-01-20T11:52:00').toISOString() },
          { id: '26', user_id: '26', user_name: 'DianPermata', user_level: 2, is_vip: false, message: 'Gamenya itu loh, simpel tapi bikin penasaran', created_at: new Date('2024-01-20T11:54:00').toISOString() },
          { id: '27', user_id: '27', user_name: 'FajarNugroho', user_level: 2, is_vip: false, message: 'bener, ga sadar udah main setengah jam sendiri', created_at: new Date('2024-01-20T11:55:00').toISOString() },
          { id: '28', user_id: '28', user_name: 'IndahPermatasari', user_level: 1, is_vip: false, message: 'Poinnya bisa dituker ga sih?', created_at: new Date('2024-01-20T11:58:00').toISOString() },
          { id: '29', user_id: '29', user_name: 'Admin_Renata', user_level: 10, is_vip: true, message: 'Belum bisa kak Indah, tapi ditunggu aja updatenya ya :)', created_at: new Date('2024-01-20T12:05:00').toISOString() },
          { id: '30', user_id: '30', user_name: 'AndiMalaka', user_level: 1, is_vip: false, message: 'wih adminnya muncul', created_at: new Date('2024-01-20T13:30:00').toISOString() },
          { id: '31', user_id: '31', user_name: 'BayuPradana', user_level: 2, is_vip: false, message: 'siap min, ditunggu fitur barunya', created_at: new Date('2024-01-20T13:31:00').toISOString() },
          { id: '32', user_id: '32', user_name: 'KartikaSari', user_level: 3, is_vip: false, message: 'Semoga ada fitur dark mode ya min kedepannya', created_at: new Date('2024-01-20T13:35:00').toISOString() },
          { id: '33', user_id: '33', user_name: 'Nurhayati85', user_level: 2, is_vip: false, message: 'setuju bgt, biar hemat batre juga', created_at: new Date('2024-01-20T13:36:00').toISOString() },
          { id: '34', user_id: '34', user_name: 'RudiHartono', user_level: 2, is_vip: false, message: 'Apk ini ringan banget, ga bikin hp lemot', created_at: new Date('2024-01-20T13:40:00').toISOString() },
          { id: '35', user_id: '35', user_name: 'TeguhPrasetyo', user_level: 2, is_vip: false, message: 'iya di hp kentangku juga lancar jaya', created_at: new Date('2024-01-20T13:40:30').toISOString() },
          { id: '36', user_id: '36', user_name: 'VinaPanduwinataKW', user_level: 2, is_vip: false, message: 'Gokil, ini aplikasi yg kucari selama ini', created_at: new Date('2024-01-20T15:02:00').toISOString() },
          { id: '37', user_id: '37', user_name: 'YusufMaulana', user_level: 3, is_vip: false, message: 'Rekomen ke temen2 kantor, pada suka semua', created_at: new Date('2024-01-20T15:05:00').toISOString() },
          { id: '38', user_id: '38', user_name: 'ZainalAbidin', user_level: 2, is_vip: false, message: 'Komunitasnya juga asik, jadi nambah temen', created_at: new Date('2024-01-20T15:08:00').toISOString() },
          { id: '39', user_id: '39', user_name: 'AsepSunandar', user_level: 1, is_vip: false, message: 'bener kang, pada ramah semua disini', created_at: new Date('2024-01-20T15:09:00').toISOString() },
          { id: '40', user_id: '40', user_name: 'BungaCitra', user_level: 3, is_vip: false, message: 'pokoknya aplot konten baru terus ya min, jangan kasih kendor', created_at: new Date('2024-01-20T15:12:00').toISOString() },
          { id: '41', user_id: '41', user_name: 'CandraWijaya', user_level: 4, is_vip: true, message: 'setiap hari pasti buka aplikasi ini, udah jadi kebiasaan', created_at: new Date('2024-01-20T15:20:00').toISOString() },
          { id: '42', user_id: '42', user_name: 'DoniSaputra', user_level: 4, is_vip: true, message: 'sama, pagi2 dengerin audio disini bikin semangat kerja', created_at: new Date('2024-01-20T15:21:00').toISOString() }
        ];
        setMessages(mockMessages);
      } else {
        setMessages(chatMessages || []);
      }
      
      setIsLoading(false);
    };

    loadMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          setMessages(current => [...current, payload.new as ChatMessageData]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      console.log('Message is empty, not sending');
      return;
    }

    if (!currentUser) {
      console.log('No current user found, cannot send message');
      toast({
        title: "Authentication Required",
        description: "Please log in to send messages",
        variant: "destructive"
      });
      return;
    }

    console.log('Attempting to send message with user:', currentUser);
    console.log('Message data:', {
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_level: currentUser.level,
      is_vip: currentUser.isVip,
      message: message.trim()
    });

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_level: currentUser.level,
          is_vip: currentUser.isVip,
          message: message.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Message sent successfully');
        // Award XP for chat message
        awardXP('chat_message', 1, 'Sent a chat message');
        setMessage("");
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold font-orbitron text-foreground">
              Komunitas Spiritual
            </h1>
            <p className="text-sm text-muted-foreground">
              127 anggota online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading chat history...</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                user={{
                  id: msg.user_id,
                  name: msg.user_name,
                  level: msg.user_level,
                  isVip: msg.is_vip,
                  avatar: ""
                }}
                message={msg.message}
                timestamp={new Date(msg.created_at)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-16 bg-background border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Bagikan energi positif Anda..."
            className="cyber-input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}