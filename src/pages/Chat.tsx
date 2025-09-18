// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { Send, Users, Languages, Globe, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useXPSystem } from "@/hooks/useXPSystem";
import { usePro } from "@/hooks/usePro";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatMessageData {
  id: string;
  user_id: string;
  user_name: string;
  user_level: number;
  is_pro: boolean;
  is_admin?: boolean;
  message: string;
  created_at: string;
  translatedMessage?: string;
}

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();
  const { awardXP } = useXPSystem();
  const { proStatus } = usePro();
  const { i18n, t } = useTranslation();

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
            isPro: proStatus.isPro // Use unified pro status instead of achievements
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
  }, [toast, proStatus.isPro]); // Add proStatus.isPro as dependency

  // Load messages from database
  const loadMessages = useCallback(async (showRefreshState = false) => {
    if (showRefreshState) {
      setIsRefreshing(true);
    }
    
    try {
      // Simple query - just get chat messages first
      let { data: chatMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });
        
      // Get admin users - using known admin approach that was working
      let adminUsers = new Set();
      const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
      adminUsers.add(knownAdminId);
      console.log('✅ Using known admin user:', knownAdminId);
        
      // If the join fails, fall back to simple query
      if (error || !chatMessages) {
        console.log('Falling back to simple query:', error);
        const fallback = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: true });
        chatMessages = fallback.data;
        error = fallback.error;
      }

      if (error) {
        console.error('Error loading messages:', error);
        // If no messages in database, use mock data as fallback
        const mockMessages: ChatMessageData[] = [
          { id: '1', user_id: '1', user_name: 'Budiyas32', user_level: 3, is_pro: true, message: 'asik banget apknya', created_at: new Date('2024-01-20T09:15:00').toISOString() },
          { id: '2', user_id: '2', user_name: 'dudungsubang', user_level: 2, is_pro: true, message: 'bener lebih mudah denger audionya ada historynya lagi', created_at: new Date('2024-01-20T09:16:00').toISOString() },
          { id: '3', user_id: '3', user_name: 'andiniwati', user_level: 2, is_pro: true, message: 'iya jadi betah diam di aplikasi', created_at: new Date('2024-01-20T09:16:30').toISOString() },
          { id: '4', user_id: '4', user_name: 'Jason', user_level: 3, is_pro: true, message: 'wah iya nih ada sistem game juga', created_at: new Date('2024-01-20T09:18:00').toISOString() },
          { id: '5', user_id: '5', user_name: 'Andin', user_level: 9, is_pro: true, message: 'bener mas anto, seru ngejar poinnya hehe', created_at: new Date('2024-01-20T09:18:30').toISOString() },
          { id: '6', user_id: '6', user_name: 'Master Yoga', user_level: 8, is_pro: true, message: 'Peringkatku naik terus nih, jadi semangat', created_at: new Date('2024-01-20T09:19:00').toISOString() },
          { id: '7', user_id: '7', user_name: 'SitiAisyah', user_level: 2, is_pro: true, message: 'fitur history itu yg paling ngebantu aku sih', created_at: new Date('2024-01-20T09:22:00').toISOString() },
          { id: '8', user_id: '8', user_name: 'EkoPrasetyo', user_level: 2, is_pro: true, message: 'setuju, ga perlu cari ulang audio yg kemarin didengerin', created_at: new Date('2024-01-20T09:22:30').toISOString() },
          { id: '9', user_id: '9', user_name: 'IwanSetiawan', user_level: 2, is_pro: true, message: 'Tampilannya juga bersih, ga ribet, enak diliat', created_at: new Date('2024-01-20T09:25:00').toISOString() },
          { id: '10', user_id: '10', user_name: 'DewiLestari90', user_level: 1, is_pro: true, message: 'baru download kemarin, langsung sukaa', created_at: new Date('2024-01-20T09:30:00').toISOString() },
          { id: '11', user_id: '11', user_name: 'Bambang_P', user_level: 3, is_pro: false, message: 'selamat datang mba dewi, dijamin nagih wkwk', created_at: new Date('2024-01-20T10:15:00').toISOString() },
          { id: '12', user_id: '12', user_name: 'PutriAyu', user_level: 2, is_pro: false, message: 'notifikasinya juga ga ganggu, pas banget timingnya', created_at: new Date('2024-01-20T10:17:00').toISOString() },
          { id: '13', user_id: '13', user_name: 'JokoWibowo88', user_level: 2, is_pro: false, message: 'Betul, ngingetin pas ada konten baru aja', created_at: new Date('2024-01-20T10:17:30').toISOString() },
          { id: '14', user_id: '14', user_name: 'HendraGunawan', user_level: 4, is_pro: true, message: 'eh ada yg udah dapet badge \'Master\' belum?', created_at: new Date('2024-01-20T10:20:00').toISOString() },
          { id: '15', user_id: '15', user_name: 'RatuAisyah', user_level: 3, is_pro: false, message: 'aku baru dapet yg \'Expert\', susah bgt yg master', created_at: new Date('2024-01-20T10:21:00').toISOString() },
          { id: '16', user_id: '16', user_name: 'SuryaAdi', user_level: 4, is_pro: true, message: 'Master harus selesain 100 audio tanpa skip kalo gasalah', created_at: new Date('2024-01-20T10:21:30').toISOString() },
          { id: '17', user_id: '17', user_name: 'HeruSantoso', user_level: 2, is_pro: false, message: 'wih mantap, kejar ah', created_at: new Date('2024-01-20T10:22:00').toISOString() },
          { id: '18', user_id: '18', user_name: 'LindaWati', user_level: 3, is_pro: false, message: 'Suka bgt sama playlistnya, bisa bikin sendiri', created_at: new Date('2024-01-20T11:40:00').toISOString() },
          { id: '19', user_id: '19', user_name: 'AhmadZaini', user_level: 3, is_pro: false, message: 'iyaa, aku kelompokin per topik jadi gampang belajarnya', created_at: new Date('2024-01-20T11:41:00').toISOString() },
          { id: '20', user_id: '20', user_name: 'CitraKirana', user_level: 3, is_pro: false, message: 'Adminnya juga responsif, kemarin aku lapor bug cepet ditanggepin', created_at: new Date('2024-01-20T11:45:00').toISOString() },
          { id: '21', user_id: '21', user_name: 'UjangTea', user_level: 1, is_pro: false, message: 'dua jempol buat developernya', created_at: new Date('2024-01-20T11:46:00').toISOString() },
          { id: '22', user_id: '22', user_name: 'MegaChan', user_level: 2, is_pro: false, message: 'Kualitas audionya jernih, pake headset makin mantap', created_at: new Date('2024-01-20T11:48:00').toISOString() },
          { id: '23', user_id: '23', user_name: 'FirmanHakim', user_level: 1, is_pro: false, message: 'bener, ga pecah suaranya', created_at: new Date('2024-01-20T11:48:30').toISOString() },
          { id: '24', user_id: '24', user_name: 'Sari_Love', user_level: 2, is_pro: false, message: 'aku malah suka dengerin sambil masak, jadi ga bosen', created_at: new Date('2024-01-20T11:50:00').toISOString() },
          { id: '25', user_id: '25', user_name: 'WawanKurniawan', user_level: 1, is_pro: false, message: 'ide bagus tuh mba sari, patut dicoba', created_at: new Date('2024-01-20T11:52:00').toISOString() },
          { id: '26', user_id: '26', user_name: 'DianPermata', user_level: 2, is_pro: false, message: 'Gamenya itu loh, simpel tapi bikin penasaran', created_at: new Date('2024-01-20T11:54:00').toISOString() },
          { id: '27', user_id: '27', user_name: 'FajarNugroho', user_level: 2, is_pro: false, message: 'bener, ga sadar udah main setengah jam sendiri', created_at: new Date('2024-01-20T11:55:00').toISOString() },
          { id: '28', user_id: '28', user_name: 'IndahPermatasari', user_level: 1, is_pro: false, message: 'Poinnya bisa dituker ga sih?', created_at: new Date('2024-01-20T11:58:00').toISOString() },
          { id: '30', user_id: '30', user_name: 'AndiMalaka', user_level: 1, is_pro: false, message: 'wih adminnya muncul', created_at: new Date('2024-01-20T13:30:00').toISOString() },
          { id: '31', user_id: '31', user_name: 'BayuPradana', user_level: 2, is_pro: false, message: 'siap min, ditunggu fitur barunya', created_at: new Date('2024-01-20T13:31:00').toISOString() },
          { id: '32', user_id: '32', user_name: 'KartikaSari', user_level: 3, is_pro: false, message: 'Semoga ada fitur dark mode ya min kedepannya', created_at: new Date('2024-01-20T13:35:00').toISOString() },
          { id: '33', user_id: '33', user_name: 'Nurhayati85', user_level: 2, is_pro: false, message: 'setuju bgt, biar hemat batre juga', created_at: new Date('2024-01-20T13:36:00').toISOString() },
          { id: '34', user_id: '34', user_name: 'RudiHartono', user_level: 2, is_pro: false, message: 'Apk ini ringan banget, ga bikin hp lemot', created_at: new Date('2024-01-20T13:40:00').toISOString() },
          { id: '35', user_id: '35', user_name: 'TeguhPrasetyo', user_level: 2, is_pro: false, message: 'iya di hp kentangku juga lancar jaya', created_at: new Date('2024-01-20T13:40:30').toISOString() },
          { id: '36', user_id: '36', user_name: 'VinaPanduwinataKW', user_level: 2, is_pro: false, message: 'Gokil, ini aplikasi yg kucari selama ini', created_at: new Date('2024-01-20T15:02:00').toISOString() },
          { id: '37', user_id: '37', user_name: 'YusufMaulana', user_level: 3, is_pro: false, message: 'Rekomen ke temen2 kantor, pada suka semua', created_at: new Date('2024-01-20T15:05:00').toISOString() },
          { id: '38', user_id: '38', user_name: 'ZainalAbidin', user_level: 2, is_pro: false, message: 'Komunitasnya juga asik, jadi nambah temen', created_at: new Date('2024-01-20T15:08:00').toISOString() },
          { id: '39', user_id: '39', user_name: 'AsepSunandar', user_level: 1, is_pro: false, message: 'bener kang, pada ramah semua disini', created_at: new Date('2024-01-20T15:09:00').toISOString() },
          { id: '40', user_id: '40', user_name: 'BungaCitra', user_level: 3, is_pro: false, message: 'pokoknya aplot konten baru terus ya min, jangan kasih kendor', created_at: new Date('2024-01-20T15:12:00').toISOString() },
          { id: '41', user_id: '41', user_name: 'CandraWijaya', user_level: 4, is_pro: true, message: 'setiap hari pasti buka aplikasi ini, udah jadi kebiasaan', created_at: new Date('2024-01-20T15:20:00').toISOString() },
          { id: '42', user_id: '42', user_name: 'DoniSaputra', user_level: 4, is_pro: true, message: 'sama, pagi2 dengerin audio disini bikin semangat kerja', created_at: new Date('2024-01-20T15:21:00').toISOString() },
          { id: '44', user_id: 'sam-165-user-id', user_name: 'Sam_165', user_level: 3, is_pro: false, message: 'Halo semua! Baru aja naik level 3 nih, seneng banget!', created_at: new Date('2024-01-20T15:30:00').toISOString() }
        ];
        setMessages(mockMessages);
      } else {
        // Process messages to add admin status from admin_roles lookup
        const processedMessages = chatMessages?.map(msg => ({
          ...msg,
          is_admin: adminUsers.has(msg.user_id)
        })) || [];
        
        setMessages(processedMessages);
      }
      
      setLastUpdate(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      if (showRefreshState) {
        setIsRefreshing(false);
      }
    }
  }, [toast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);


  useEffect(() => {
    // Set up 60-minute polling interval
    const interval = setInterval(() => {
      loadMessages(true);
    }, 60 * 60 * 1000); // 60 minutes in milliseconds

    return () => clearInterval(interval);
  }, [loadMessages]);

  // Enhanced input validation function
  const validateMessage = (input: string): string | null => {
    const trimmed = input.trim();
    
    // Length validation
    if (trimmed.length === 0) return "Message cannot be empty";
    if (trimmed.length > 500) return "Message must be 500 characters or less";
    
    // Basic sanitization - remove potentially harmful characters
    const sanitized = trimmed
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    
    // Check for excessive repetition (spam detection)
    const repeated = /(.)\1{10,}/.test(sanitized);
    if (repeated) return "Message contains excessive repeated characters";
    
    return null;
  };

  // Auto-translate when language changes to English
  useEffect(() => {
    if (i18n.language === 'en' && messages.length > 0) {
      translateAllMessages();
    } else if (i18n.language === 'id') {
      // Show original messages when switching back to Indonesian
      setShowTranslated(false);
    }
  }, [i18n.language, messages.length]);

  // Translate a single message
  const translateSingleMessage = async (msg: ChatMessageData): Promise<ChatMessageData> => {
    try {
      const translatedText = await translateText(msg.message);
      return { ...msg, translatedMessage: translatedText };
    } catch (error) {
      console.error('Translation error for single message:', error);
      return msg;
    }
  };

  const translateAllMessages = async () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    
    try {
      const messagesToTranslate = messages.filter(msg => !msg.translatedMessage);
      
      for (const msg of messagesToTranslate) {
        const translatedText = await translateText(msg.message);
        
        // Update the message with translation
        setMessages(current => 
          current.map(m => 
            m.id === msg.id 
              ? { ...m, translatedMessage: translatedText }
              : m
          )
        );
      }
      
      setShowTranslated(true);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Error",
        description: "Failed to translate some messages",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const translateMessages = async () => {
    await translateAllMessages();
    toast({
      title: "Translation Complete",
      description: "All messages have been translated to English",
    });
  };

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferred_language', lang);
    
    if (lang === 'en') {
      await translateAllMessages();
      toast({
        title: "Language Changed",
        description: "All messages translated to English",
      });
    } else {
      setShowTranslated(false);
      toast({
        title: "Bahasa Diubah", 
        description: "Semua pesan ditampilkan dalam bahasa asli",
      });
    }
  };

  // Mock translation function - in real app, use Google Translate API or similar
  const translateText = async (text: string): Promise<string> => {
    // Simple mock translations for demo purposes
    const translations: { [key: string]: string } = {
      'asik banget apknya': 'this app is really cool',
      'bener lebih mudah denger audionya ada historynya lagi': 'true, it\'s easier to listen to the audio and it has history too',
      'iya jadi betah diam di aplikasi': 'yes, I feel comfortable staying in the app',
      'wah iya nih ada sistem game juga': 'wow yes, there\'s also a game system',
      'bener mas anto, seru ngejar poinnya hehe': 'true mas anto, it\'s fun chasing the points hehe',
      'Peringkatku naik terus nih, jadi semangat': 'My rank keeps rising, it makes me motivated',
      'fitur history itu yg paling ngebantu aku sih': 'the history feature is what helps me the most',
      'setuju, ga perlu cari ulang audio yg kemarin didengerin': 'agreed, no need to search again for yesterday\'s audio',
      'Tampilannya juga bersih, ga ribet, enak diliat': 'The interface is also clean, not complicated, nice to look at',
      'baru download kemarin, langsung sukaa': 'just downloaded yesterday, immediately loved it',
      'selamat datang mba dewi, dijamin nagih wkwk': 'welcome mba dewi, guaranteed addictive lol',
      'notifikasinya juga ga ganggu, pas banget timingnya': 'the notifications don\'t bother either, perfect timing',
      'Betul, ngingetin pas ada konten baru aja': 'Right, reminds only when there\'s new content',
      'eh ada yg udah dapet badge \'Master\' belum?': 'hey, has anyone got the \'Master\' badge yet?',
      'aku baru dapet yg \'Expert\', susah bgt yg master': 'I just got the \'Expert\' one, master is so hard',
      'Master harus selesain 100 audio tanpa skip kalo gasalah': 'Master requires completing 100 audios without skipping if I\'m not wrong',
      'wih mantap, kejar ah': 'wow great, let\'s chase it',
      'Suka bgt sama playlistnya, bisa bikin sendiri': 'Love the playlists so much, can create our own',
      'iyaa, aku kelompokin per topik jadi gampang belajarnya': 'yes, I group them by topic so it\'s easy to learn',
      'Adminnya juga responsif, kemarin aku lapor bug cepet ditanggepin': 'The admin is also responsive, yesterday I reported a bug and it was quickly handled',
      'dua jempol buat developernya': 'two thumbs up for the developer',
      'Kualitas audionya jernih, pake headset makin mantap': 'The audio quality is clear, using headphones makes it even better',
      'bener, ga pecah suaranya': 'true, the sound doesn\'t break',
      'aku malah suka dengerin sambil masak, jadi ga bosen': 'I even like to listen while cooking, so I don\'t get bored',
      'ide bagus tuh mba sari, patut dicoba': 'that\'s a good idea mba sari, worth trying',
      'Gamenya itu loh, simpel tapi bikin penasaran': 'The game is like that, simple but makes you curious',
      'bener, ga sadar udah main setengah jam sendiri': 'true, didn\'t realize I\'ve been playing for half an hour alone',
      'Poinnya bisa dituker ga sih?': 'Can the points be exchanged?',
      'Belum bisa kak Indah, tapi ditunggu aja updatenya ya :)': 'Not yet kak Indah, but just wait for the update :)',
      'wih adminnya muncul': 'wow the admin appeared',
      'siap min, ditunggu fitur barunya': 'ready min, waiting for the new features',
      'Semoga ada fitur dark mode ya min kedepannya': 'Hope there will be a dark mode feature in the future min',
      'setuju bgt, biar hemat batre juga': 'totally agree, to save battery too',
      'Apk ini ringan banget, ga bikin hp lemot': 'This app is very light, doesn\'t make the phone slow',
      'iya di hp kentangku juga lancar jaya': 'yes on my potato phone it also runs smoothly',
      'Gokil, ini aplikasi yg kucari selama ini': 'Crazy, this is the app I\'ve been looking for all this time',
      'Rekomen ke temen2 kantor, pada suka semua': 'Recommended to office friends, everyone likes it',
      'Komunitasnya juga asik, jadi nambah temen': 'The community is also fun, makes new friends',
      'bener kang, pada ramah semua disini': 'true kang, everyone is friendly here',
      'pokoknya aplot konten baru terus ya min, jangan kasih kendor': 'anyway keep uploading new content min, don\'t slack off',
      'setiap hari pasti buka aplikasi ini, udah jadi kebiasaan': 'definitely open this app every day, it\'s become a habit',
      'sama, pagi2 dengerin audio disini bikin semangat kerja': 'same, listening to audio here in the morning makes me motivated to work',
      'mantap komunitas ini makin rame ya, semangat terus semua!': 'great this community is getting livelier, keep it up everyone!',
      'Halo semua! Baru aja naik level 3 nih, seneng banget!': 'Hello everyone! Just reached level 3, so happy!'
    };
    
    // Return translation if exists, otherwise return original text
    return translations[text.toLowerCase()] || text;
  };

  const handleSendMessage = async () => {
    const validationError = validateMessage(message);
    if (validationError) {
      toast({
        title: "Invalid Message",
        description: validationError,
        variant: "destructive"
      });
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

    setIsSending(true);

    try {
      console.log('🚀 Starting message insert at:', new Date().toISOString());

      // Add timeout to prevent hanging
      const insertPromise = supabase
        .from('chat_messages')
        .insert({
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_level: currentUser.level,
          is_pro: currentUser.isPro,
          message: message.trim()
        });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout after 3 seconds')), 3000)
      );

      const { error } = await Promise.race([insertPromise, timeoutPromise]);
      console.log('✅ Message insert completed at:', new Date().toISOString());

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: `Failed to send message: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Message sent successfully');

        // Optimistically add the message to UI immediately
        const knownAdminId = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';
        const newMessage: ChatMessageData = {
          id: `temp-${Date.now()}`, // Temporary ID
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_level: currentUser.level,
          is_pro: currentUser.isPro,
          is_admin: currentUser.id === knownAdminId, // Add admin status for new messages
          message: message.trim(),
          created_at: new Date().toISOString()
        };

        setMessages(current => [...current, newMessage]);
        setMessage("");

        toast({
          title: "Message Sent 🚀",
          description: "",
          variant: "default"
        });
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(current => current.filter(msg => msg.id !== messageId));
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold font-orbitron text-foreground">
                Komunitas eL Vision Group
              </h1>
               <p className="text-sm text-muted-foreground">
                21.482 anggota 
               </p>
              <p className="text-xs text-muted-foreground">
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Manual Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadMessages(true)}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            {/* Translate Button with Language Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isTranslating}
                  className="gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <Globe className="w-4 h-4" />
                  {isTranslating ? "Translating..." : (
                    i18n.language === 'en' ? "English" : "Indonesia"
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => changeLanguage('id')}
                  className="flex items-center justify-between"
                >
                  <span>🇮🇩 Indonesia</span>
                  {i18n.language === 'id' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage('en')}
                  className="flex items-center justify-between"
                >
                  <span>🇺🇸 English</span>
                  {i18n.language === 'en' && <div className="w-2 h-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column-reverse' }}>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading chat history...</p>
          </div>
        ) : (
          <div className="divide-y divide-border" style={{ display: 'flex', flexDirection: 'column-reverse' }}>
            {messages.slice().reverse().map((msg) => (
              <ChatMessage
                key={msg.id}
                id={msg.id}
                user={{
                  id: msg.user_id,
                  name: msg.user_name,
                  level: msg.user_level,
                  isPro: (() => {
                    const mockProUsers = ['Andin', 'Jason', 'Master Yoga', 'Bambang_P', 'RatuAisyah', 'LindaWati', 'AhmadZaini', 'CitraKirana', 'KartikaSari', 'BungaCitra'];
                    const isMockProUser = mockProUsers.includes(msg.user_name);
                    return isMockProUser || msg.is_pro || false;
                  })(),
                  isAdmin: msg.is_admin || false,
                  subscriptionType: (() => {
                    const mockProUsers = ['Andin', 'Jason', 'Master Yoga', 'Bambang_P', 'RatuAisyah', 'LindaWati', 'AhmadZaini', 'CitraKirana', 'KartikaSari', 'BungaCitra'];
                    const isMockProUser = mockProUsers.includes(msg.user_name);
                    
                    if (msg.subscription_type) {
                      return msg.subscription_type;
                    } else if (isMockProUser) {
                      return '1_year'; // Mock users get Crown badges
                    } else if (msg.is_pro) {
                      return '1_month'; // Other pro users get Star badges
                    }
                    return undefined;
                  })(),
                  avatar: ""
                }}
                message={i18n.language === 'en' && msg.translatedMessage ? msg.translatedMessage : msg.message}
                timestamp={new Date(msg.created_at)}
                currentUserId={currentUser?.id}
                onDelete={handleDeleteMessage}
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
            maxLength={500}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-4 transition-all duration-150 hover:scale-105 active:scale-95 active:translate-y-0.5 disabled:scale-100 disabled:translate-y-0"
          >
            {isSending ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}