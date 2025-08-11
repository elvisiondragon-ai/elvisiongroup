export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audio_tracks: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: number | null
          file_path: string
          file_url: string | null
          id: string
          is_public: boolean | null
          language: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          file_path: string
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          file_path?: string
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_pro: boolean | null
          message: string
          user_id: string
          user_level: number
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_pro?: boolean | null
          message: string
          user_id: string
          user_level?: number
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_pro?: boolean | null
          message?: string
          user_id?: string
          user_level?: number
          user_name?: string
        }
        Relationships: []
      }
      device_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          chat_notifications_enabled: boolean
          created_at: string
          id: string
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_notifications_enabled?: boolean
          created_at?: string
          id?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_notifications_enabled?: boolean
          created_at?: string
          id?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          callback_data: Json | null
          created_at: string
          currency: string | null
          expires_at: string | null
          id: string
          paid_at: string | null
          payment_instructions: Json | null
          payment_method: string | null
          payment_url: string | null
          status: string
          subscription_id: string
          tripay_merchant_ref: string
          tripay_reference: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          callback_data?: Json | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          paid_at?: string | null
          payment_instructions?: Json | null
          payment_method?: string | null
          payment_url?: string | null
          status?: string
          subscription_id: string
          tripay_merchant_ref: string
          tripay_reference: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          callback_data?: Json | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          id?: string
          paid_at?: string | null
          payment_instructions?: Json | null
          payment_method?: string | null
          payment_url?: string | null
          status?: string
          subscription_id?: string
          tripay_merchant_ref?: string
          tripay_reference?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "vip_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievements: string[] | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          experience_points: number
          id: string
          level: number
          preferred_language: string | null
          streak_days: number
          total_sessions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          experience_points?: number
          id?: string
          level?: number
          preferred_language?: string | null
          streak_days?: number
          total_sessions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          experience_points?: number
          id?: string
          level?: number
          preferred_language?: string | null
          streak_days?: number
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reflections: {
        Row: {
          created_at: string
          id: string
          question: string
          reflection: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question: string
          reflection: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question?: string
          reflection?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      vip_subscriptions: {
        Row: {
          amount_paid: number | null
          created_at: string
          currency: string | null
          email: string
          id: string
          ip_address: string | null
          status: string
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_type: string
          trial_end_date: string | null
          trial_start_date: string | null
          tripay_reference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          ip_address?: string | null
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          tripay_reference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          tripay_reference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          activity_id: string | null
          created_at: string
          id: string
          reason: string | null
          transaction_type: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          transaction_type: string
          user_id: string
          xp_amount: number
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          transaction_type?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: {
          p_user_id: string
          p_xp_amount: number
          p_activity_type: string
          p_reason?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      calculate_level_from_xp: {
        Args: { total_xp: number }
        Returns: number
      }
      check_daily_audio_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_daily_chat_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_daily_journal_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_vip_status: {
        Args: { p_user_id: string }
        Returns: {
          is_vip: boolean
          subscription_type: string
          status: string
          expires_at: string
          days_remaining: number
        }[]
      }
      get_xp_for_next_level: {
        Args: { current_level: number }
        Returns: number
      }
      start_vip_trial: {
        Args: { p_user_id: string; p_email: string; p_ip_address?: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
