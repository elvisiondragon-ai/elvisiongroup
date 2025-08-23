export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action: string
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          requires_approval: boolean | null
          resource_id: string | null
          risk_score: number | null
          target_resource: string | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          requires_approval?: boolean | null
          resource_id?: string | null
          risk_score?: number | null
          target_resource?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          requires_approval?: boolean | null
          resource_id?: string | null
          risk_score?: number | null
          target_resource?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          is_active: boolean
          role: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          is_active?: boolean
          role: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id?: string
        }
        Relationships: []
      }
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
          allowed_users: string[] | null
          channel_id: string | null
          created_at: string
          id: string
          is_private: boolean | null
          is_pro: boolean | null
          message: string
          user_id: string
          user_level: number
          user_name: string
        }
        Insert: {
          allowed_users?: string[] | null
          channel_id?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          is_pro?: boolean | null
          message: string
          user_id: string
          user_level?: number
          user_name: string
        }
        Update: {
          allowed_users?: string[] | null
          channel_id?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          is_pro?: boolean | null
          message?: string
          user_id?: string
          user_level?: number
          user_name?: string
        }
        Relationships: []
      }
      data_classification: {
        Row: {
          audit_required: boolean | null
          classification: string
          created_at: string
          pii_fields: string[] | null
          retention_days: number | null
          table_name: string
        }
        Insert: {
          audit_required?: boolean | null
          classification: string
          created_at?: string
          pii_fields?: string[] | null
          retention_days?: number | null
          table_name: string
        }
        Update: {
          audit_required?: boolean | null
          classification?: string
          created_at?: string
          pii_fields?: string[] | null
          retention_days?: number | null
          table_name?: string
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
      orders: {
        Row: {
          amount: number
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          end_date: string | null
          id: string
          merchant_ref: string
          payment_method: string | null
          payment_status: string | null
          start_date: string | null
          subscription_type: string
          tripay_reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          end_date?: string | null
          id?: string
          merchant_ref: string
          payment_method?: string | null
          payment_status?: string | null
          start_date?: string | null
          subscription_type: string
          tripay_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          end_date?: string | null
          id?: string
          merchant_ref?: string
          payment_method?: string | null
          payment_status?: string | null
          start_date?: string | null
          subscription_type?: string
          tripay_reference?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          duration_days: number | null
          id: string
          name: string | null
          price: number | null
        }
        Insert: {
          duration_days?: number | null
          id: string
          name?: string | null
          price?: number | null
        }
        Update: {
          duration_days?: number | null
          id?: string
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          bank_account: string | null
          callback_data: Json | null
          created_at: string
          currency: string | null
          customer_phone: string | null
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
          unique_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_account?: string | null
          callback_data?: Json | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
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
          unique_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account?: string | null
          callback_data?: Json | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
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
          unique_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "pro_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "pro_subscriptions_admin_view"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_subscriptions: {
        Row: {
          amount_paid: number | null
          created_at: string
          currency: string | null
          customer_phone: string | null
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
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
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
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
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
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pro_user: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          customer_phone: string | null
          email: string
          end_date: string | null
          id: string
          payment_method: string | null
          start_date: string | null
          status: string
          subscription_type: string
          tripay_reference: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
          email: string
          end_date?: string | null
          id?: string
          payment_method?: string | null
          start_date?: string | null
          status?: string
          subscription_type?: string
          tripay_reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_phone?: string | null
          email?: string
          end_date?: string | null
          id?: string
          payment_method?: string | null
          start_date?: string | null
          status?: string
          subscription_type?: string
          tripay_reference?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievements: string[] | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          experience_points: number
          id: string
          is_premium: boolean | null
          level: number
          preferred_language: string | null
          premium_expires_at: string | null
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
          is_premium?: boolean | null
          level?: number
          preferred_language?: string | null
          premium_expires_at?: string | null
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
          is_premium?: boolean | null
          level?: number
          preferred_language?: string | null
          premium_expires_at?: string | null
          streak_days?: number
          total_sessions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_log: {
        Row: {
          action: string
          attempts: number | null
          created_at: string | null
          id: string
          ip_address: string | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          action: string
          attempts?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          action?: string
          attempts?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
          window_start?: string | null
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
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          name: string
          payment_method: string | null
          payment_method_code: string | null
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days: number
          id: string
          is_active?: boolean | null
          name: string
          payment_method?: string | null
          payment_method_code?: string | null
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name?: string
          payment_method?: string | null
          payment_method_code?: string | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string | null
          customer_email: string
          id: number
          merchant_ref: string
          package_type: string
          paid_at: number | null
          status: string | null
          tripay_reference: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_email: string
          id?: number
          merchant_ref: string
          package_type: string
          paid_at?: number | null
          status?: string | null
          tripay_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_email?: string
          id?: number
          merchant_ref?: string
          package_type?: string
          paid_at?: number | null
          status?: string | null
          tripay_reference?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string | null
          expired_at: string | null
          id: number
          merchant_ref: string | null
          package_id: string | null
          status: string | null
          tripay_reference: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          expired_at?: string | null
          id?: number
          merchant_ref?: string | null
          package_id?: string | null
          status?: string | null
          tripay_reference?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          expired_at?: string | null
          id?: number
          merchant_ref?: string | null
          package_id?: string | null
          status?: string | null
          tripay_reference?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
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
      user_contact_info: {
        Row: {
          created_at: string
          email_encrypted: string
          email_hash: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_encrypted: string
          email_hash: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_encrypted?: string
          email_hash?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          created_at: string | null
          expires_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
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
      pro_subscriptions_admin_view: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          currency: string | null
          display_name: string | null
          id: string | null
          readable_status: string | null
          status: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_type: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          display_name?: never
          id?: string | null
          readable_status?: never
          status?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          display_name?: never
          id?: string | null
          readable_status?: never
          status?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_achievement: {
        Args: { achievement: string; user_id: string }
        Returns: undefined
      }
      add_pro_user_by_email: {
        Args: {
          p_duration_days?: number
          p_email: string
          p_subscription_type?: string
        }
        Returns: Json
      }
      admin_system_health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      award_xp: {
        Args: {
          p_activity_type: string
          p_metadata?: Json
          p_reason?: string
          p_user_id: string
          p_xp_amount: number
        }
        Returns: undefined
      }
      calculate_level_from_xp: {
        Args: { total_xp: number }
        Returns: number
      }
      calculate_subscription_end_date: {
        Args: { p_start_date: string; p_subscription_type: string }
        Returns: string
      }
      can_access_payment_transaction: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
      }
      can_access_verse: {
        Args: { p_user_id: string; p_verse_number: number }
        Returns: boolean
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
      check_pro_status: {
        Args: { p_user_id: string }
        Returns: {
          days_remaining: number
          expires_at: string
          is_pro: boolean
          status: string
          subscription_type: string
        }[]
      }
      check_rate_limit: {
        Args: {
          p_action: string
          p_max_attempts?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_sensitive_data_rate_limit: {
        Args: { p_table_name: string; p_user_id: string }
        Returns: boolean
      }
      check_vip_status: {
        Args: { p_user_id: string }
        Returns: {
          days_remaining: number
          expires_at: string
          is_vip: boolean
          status: string
          subscription_type: string
        }[]
      }
      cleanup_chat_message_user_names: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_admin_roles: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_user_display_names: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_chat_message: {
        Args: {
          p_allowed_users?: string[]
          p_channel_id?: string
          p_is_private?: boolean
          p_message: string
        }
        Returns: string
      }
      decrypt_email: {
        Args: { p_encrypted_email: string }
        Returns: string
      }
      emergency_revoke_admin_role: {
        Args: { p_reason: string; p_target_user_id: string }
        Returns: Json
      }
      encrypt_email: {
        Args: { p_email: string }
        Returns: string
      }
      encrypt_payment_field: {
        Args: { p_data: string; p_field_type: string }
        Returns: string
      }
      enhanced_payment_access_control: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
      }
      get_masked_payment_transaction: {
        Args: { p_transaction_id: string }
        Returns: {
          created_at: string
          currency: string
          expires_at: string
          id: string
          masked_amount: string
          paid_at: string
          payment_method: string
          status: string
          tripay_reference: string
        }[]
      }
      get_payment_access_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          access_count: number
          last_access: string
          suspicious_activity: boolean
          user_id: string
        }[]
      }
      get_safe_subscription_data: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          masked_amount: number
          masked_currency: string
          status: string
          subscription_end_date: string
          subscription_start_date: string
          subscription_type: string
          trial_end_date: string
          trial_start_date: string
          user_id: string
        }[]
      }
      get_secure_payment_transaction: {
        Args: { p_transaction_id: string }
        Returns: {
          created_at: string
          currency: string
          expires_at: string
          id: string
          masked_amount: string
          paid_at: string
          payment_method: string
          security_metadata: Json
          status: string
          tripay_reference: string
          updated_at: string
          user_id: string
        }[]
      }
      get_user_email_safe: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_email_secure: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_user_payment_transactions: {
        Args: { p_limit?: number }
        Returns: {
          created_at: string
          currency: string
          expires_at: string
          id: string
          masked_amount: string
          paid_at: string
          payment_method: string
          status: string
          tripay_reference: string
        }[]
      }
      get_xp_for_next_level: {
        Args: { current_level: number }
        Returns: number
      }
      grant_admin_role: {
        Args: {
          p_expires_at?: string
          p_role: string
          p_target_user_id: string
        }
        Returns: boolean
      }
      grant_pro_status: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      has_pro_achievement: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      is_super_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_verified_admin: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      log_data_access: {
        Args: {
          p_metadata?: Json
          p_operation: string
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
      log_sensitive_action: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_record_id?: string
          p_table_name?: string
        }
        Returns: undefined
      }
      mask_sensitive_payment_data: {
        Args: {
          p_amount: number
          p_bank_account: string
          p_callback_data: Json
          p_moota_webhook_data: Json
          p_payment_instructions: Json
        }
        Returns: Json
      }
      revoke_admin_role: {
        Args: { p_target_user_id: string }
        Returns: boolean
      }
      revoke_pro_status: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      secure_admin_role_grant: {
        Args: {
          p_expires_at?: string
          p_justification?: string
          p_role: string
          p_target_user_id: string
        }
        Returns: Json
      }
      start_pro_trial: {
        Args: { p_email: string; p_ip_address?: string; p_user_id: string }
        Returns: string
      }
      start_vip_trial: {
        Args: { p_email: string; p_ip_address?: string; p_user_id: string }
        Returns: string
      }
      sync_pro_status_from_subscription: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      update_subscription_status_manually: {
        Args: {
          p_duration_type?: string
          p_status: string
          p_subscription_id: string
          p_subscription_type: string
        }
        Returns: Json
      }
      validate_admin_role_operation: {
        Args: { p_operation: string; p_role: string; p_target_user_id: string }
        Returns: boolean
      }
      validate_payment_access: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
      }
      validate_payment_transaction_access: {
        Args: { p_access_type?: string; p_transaction_id: string }
        Returns: boolean
      }
      verify_admin_with_failsafe: {
        Args: { p_required_role?: string; p_user_id: string }
        Returns: Json
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
