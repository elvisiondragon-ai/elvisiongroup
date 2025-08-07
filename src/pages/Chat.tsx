import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { Send, Users } from "lucide-react";

const mockMessages = [
  {
    id: "1",
    user: { id: "1", name: "Andrew", level: 3, avatar: "" },
    message: "Selamat pagi semua! Gimana meditasi pagi kalian hari ini?",
    timestamp: new Date("2024-01-15T08:30:00"),
  },
  {
    id: "2",
    user: { id: "2", name: "Budi", level: 1, avatar: "" },
    message: "Pagi Andrew! Baru aja selesai 10 menit breathing exercise. Feeling fresh banget 🧘‍♂️",
    timestamp: new Date("2024-01-15T08:32:00"),
  },
  {
    id: "3",
    user: { id: "3", name: "Jason", level: 3, isVip: true, avatar: "" },
    message: "Morning ritual completed! 30 minutes focused meditation + journaling. Energi cosmic flowing through 💜",
    timestamp: new Date("2024-01-15T08:35:00"),
  },
  {
    id: "4",
    user: { id: "4", name: "Andin", level: 9, avatar: "" },
    message: "Beautiful energy di group ini hari ini. Remember, consistency is key untuk spiritual growth. Keep shining your light! ✨",
    timestamp: new Date("2024-01-15T08:40:00"),
  },
  {
    id: "5",
    user: { id: "5", name: "Sari", level: 2, avatar: "" },
    message: "Ada yang punya tips untuk focus meditation? Masih sering distracted nih mind-nya",
    timestamp: new Date("2024-01-15T08:45:00"),
  },
];

export function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: { id: "current", name: "Anda", level: 3, avatar: "" },
        message: message.trim(),
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
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
        <div className="divide-y divide-border">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              user={msg.user}
              message={msg.message}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
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