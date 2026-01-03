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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invite_token: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invite_token: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invite_token?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          email_sent: boolean
          email_sent_at: string | null
          ghost_identity_id: string | null
          id: string
          is_read: boolean
          message: string
          negotiation_id: string | null
          notification_type: string
        }
        Insert: {
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
          ghost_identity_id?: string | null
          id?: string
          is_read?: boolean
          message: string
          negotiation_id?: string | null
          notification_type: string
        }
        Update: {
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
          ghost_identity_id?: string | null
          id?: string
          is_read?: boolean
          message?: string
          negotiation_id?: string | null
          notification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_ghost_identity_id_fkey"
            columns: ["ghost_identity_id"]
            isOneToOne: false
            referencedRelation: "ghost_identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_notifications_negotiation_id_fkey"
            columns: ["negotiation_id"]
            isOneToOne: false
            referencedRelation: "arena_negotiations"
            referencedColumns: ["id"]
          },
        ]
      }
      arena_negotiations: {
        Row: {
          admin_approved_at: string | null
          admin_approved_by: string | null
          admin_notes: string | null
          budget_level: string | null
          created_at: string
          department: string | null
          final_consensus: string | null
          governor_score: number | null
          grievance_text: string
          id: string
          negotiation_log: Json
          priority: string | null
          sentinel_score: number | null
          status: string
          updated_at: string
          urgency_level: string | null
          vault_file_id: string | null
        }
        Insert: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          admin_notes?: string | null
          budget_level?: string | null
          created_at?: string
          department?: string | null
          final_consensus?: string | null
          governor_score?: number | null
          grievance_text: string
          id?: string
          negotiation_log?: Json
          priority?: string | null
          sentinel_score?: number | null
          status?: string
          updated_at?: string
          urgency_level?: string | null
          vault_file_id?: string | null
        }
        Update: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          admin_notes?: string | null
          budget_level?: string | null
          created_at?: string
          department?: string | null
          final_consensus?: string | null
          governor_score?: number | null
          grievance_text?: string
          id?: string
          negotiation_log?: Json
          priority?: string | null
          sentinel_score?: number | null
          status?: string
          updated_at?: string
          urgency_level?: string | null
          vault_file_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arena_negotiations_vault_file_id_fkey"
            columns: ["vault_file_id"]
            isOneToOne: false
            referencedRelation: "stealth_vault"
            referencedColumns: ["id"]
          },
        ]
      }
      ghost_identities: {
        Row: {
          avatar: string
          created_at: string
          ghost_name: string
          id: string
          notification_email: string | null
          reports_submitted: number
          reputation: number
          roll_number_hash: string
          updated_at: string
        }
        Insert: {
          avatar?: string
          created_at?: string
          ghost_name: string
          id?: string
          notification_email?: string | null
          reports_submitted?: number
          reputation?: number
          roll_number_hash: string
          updated_at?: string
        }
        Update: {
          avatar?: string
          created_at?: string
          ghost_name?: string
          id?: string
          notification_email?: string | null
          reports_submitted?: number
          reputation?: number
          roll_number_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          ghost_identity_id: string | null
          id: string
          report_id: string
          severity: string
          status: string
          title: string
          updated_at: string
          vault_file_id: string | null
          zone: string
        }
        Insert: {
          created_at?: string
          ghost_identity_id?: string | null
          id?: string
          report_id: string
          severity?: string
          status?: string
          title: string
          updated_at?: string
          vault_file_id?: string | null
          zone: string
        }
        Update: {
          created_at?: string
          ghost_identity_id?: string | null
          id?: string
          report_id?: string
          severity?: string
          status?: string
          title?: string
          updated_at?: string
          vault_file_id?: string | null
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_ghost_identity_id_fkey"
            columns: ["ghost_identity_id"]
            isOneToOne: false
            referencedRelation: "ghost_identities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_vault_file_id_fkey"
            columns: ["vault_file_id"]
            isOneToOne: false
            referencedRelation: "stealth_vault"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_logs: {
        Row: {
          concern_level: string
          created_at: string
          id: string
          last_report_at: string | null
          reports_count: number
          updated_at: string
          zone_id: string
          zone_name: string
        }
        Insert: {
          concern_level: string
          created_at?: string
          id?: string
          last_report_at?: string | null
          reports_count?: number
          updated_at?: string
          zone_id: string
          zone_name: string
        }
        Update: {
          concern_level?: string
          created_at?: string
          id?: string
          last_report_at?: string | null
          reports_count?: number
          updated_at?: string
          zone_id?: string
          zone_name?: string
        }
        Relationships: []
      }
      stealth_vault: {
        Row: {
          created_at: string
          expires_at: string | null
          file_name: string
          file_path: string
          file_size: string | null
          file_type: string
          ghost_identity_id: string | null
          id: string
          secret_metadata: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          file_name: string
          file_path: string
          file_size?: string | null
          file_type: string
          ghost_identity_id?: string | null
          id?: string
          secret_metadata?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: string | null
          file_type?: string
          ghost_identity_id?: string | null
          id?: string
          secret_metadata?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stealth_vault_ghost_identity_id_fkey"
            columns: ["ghost_identity_id"]
            isOneToOne: false
            referencedRelation: "ghost_identities"
            referencedColumns: ["id"]
          },
        ]
      }
      student_otp_codes: {
        Row: {
          created_at: string
          email: string
          enrollment_no: string
          expires_at: string
          id: string
          is_used: boolean
          otp_code: string
        }
        Insert: {
          created_at?: string
          email: string
          enrollment_no: string
          expires_at: string
          id?: string
          is_used?: boolean
          otp_code: string
        }
        Update: {
          created_at?: string
          email?: string
          enrollment_no?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          otp_code?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          avatar: string
          created_at: string
          email: string
          enrollment_no: string
          ghost_name: string
          id: string
          is_verified: boolean
          reports_submitted: number
          reputation: number
          updated_at: string
        }
        Insert: {
          avatar?: string
          created_at?: string
          email: string
          enrollment_no: string
          ghost_name: string
          id?: string
          is_verified?: boolean
          reports_submitted?: number
          reputation?: number
          updated_at?: string
        }
        Update: {
          avatar?: string
          created_at?: string
          email?: string
          enrollment_no?: string
          ghost_name?: string
          id?: string
          is_verified?: boolean
          reports_submitted?: number
          reputation?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
