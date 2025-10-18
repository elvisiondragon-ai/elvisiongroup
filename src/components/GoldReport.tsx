import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoldReportProps {
  messageId: string;
  isAdmin: boolean;
  isGoldReported?: boolean;
  onToggle?: (isGoldReported: boolean) => void;
}

export function GoldReport({ messageId, isAdmin, isGoldReported = false, onToggle }: GoldReportProps) {
  const { toast } = useToast();

  const handleToggleGoldReport = async () => {
    if (!isAdmin) return;

    const previousState = isGoldReported;

    // Optimistic update - instant UI change
    if (onToggle) onToggle(!isGoldReported);

    try {
      if (previousState) {
        // Remove gold report
        const { error } = await supabase
          .from('gold_reports')
          .delete()
          .eq('message_id', messageId);

        if (error) throw error;

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

        toast({
          title: "Gold Report Added",
          description: "Message pinned successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error toggling gold report:', error);

      // Revert optimistic update on error
      if (onToggle) onToggle(previousState);

      toast({
        title: "Error",
        description: "Failed to toggle gold report",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleGoldReport}
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
