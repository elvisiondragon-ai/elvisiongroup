import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface GoldReportProps {
  messageId: string;
  isAdmin: boolean;
  onToggle?: (isGoldReported: boolean) => void;
}

export function GoldReport({ messageId, isAdmin, onToggle }: GoldReportProps) {
  const { toast } = useToast();
  const [isGoldReported, setIsGoldReported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if message is already gold reported
  useEffect(() => {
    const checkGoldReport = async () => {
      const { data, error } = await supabase
        .from('gold_reports')
        .select('id')
        .eq('message_id', messageId)
        .single();

      if (data) {
        setIsGoldReported(true);
      }
    };

    checkGoldReport();
  }, [messageId]);

  const handleToggleGoldReport = async () => {
    if (!isAdmin) return;

    setIsLoading(true);

    try {
      if (isGoldReported) {
        // Remove gold report
        const { error } = await supabase
          .from('gold_reports')
          .delete()
          .eq('message_id', messageId);

        if (error) throw error;

        setIsGoldReported(false);
        if (onToggle) onToggle(false);

        toast({
          title: "Gold Report Removed",
          description: "Message unpinned successfully",
          variant: "default"
        });
      } else {
        // Add gold report
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase
          .from('gold_reports')
          .insert({
            message_id: messageId,
            reported_by: user.id
          });

        if (error) throw error;

        setIsGoldReported(true);
        if (onToggle) onToggle(true);

        toast({
          title: "Gold Report Added",
          description: "Message pinned successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error toggling gold report:', error);
      toast({
        title: "Error",
        description: "Failed to toggle gold report",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleGoldReport}
      disabled={isLoading}
      className={`h-7 w-7 p-0 rounded-full shadow-lg transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5 ${
        isGoldReported
          ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 text-white shadow-yellow-500/50'
          : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-yellow-500 hover:from-amber-500 hover:via-yellow-500 hover:to-yellow-600 text-white shadow-amber-500/50'
      }`}
    >
      <Rocket className={`h-3.5 w-3.5 ${isGoldReported ? 'animate-pulse' : ''}`} />
    </Button>
  );
}
