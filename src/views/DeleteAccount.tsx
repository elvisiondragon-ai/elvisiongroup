"use client";
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

export const DeleteAccount = () => {
  const { userId } = useAuth();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to delete your account.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Delete all user data first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Delete related data
      await Promise.all([
        supabase.from('chat_messages').delete().eq('user_id', userId),
        supabase.from('reflections').delete().eq('user_id', userId),
        supabase.from('user_activities').delete().eq('user_id', userId),
        supabase.from('xp_transactions').delete().eq('user_id', userId),
        supabase.from('device_tokens').delete().eq('user_id', userId),
        supabase.from('notification_settings').delete().eq('user_id', userId),
        supabase.from('pro_subscriptions').delete().eq('user_id', userId),
        (supabase as any).from('payment_transactions').delete().eq('user_id', userId),
      ]);

      // Sign out the user after data deletion
      localStorage.setItem('manual-logout-flag', 'true');
      await supabase.auth.signOut();

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });

      // Redirect to home page after deletion
      window.location.href = '/';

    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
          Delete Your Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This action is irreversible. When you delete your account, all your data, including your profile, activities, and reflections, will be permanently removed.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
};