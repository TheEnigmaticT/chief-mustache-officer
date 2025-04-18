export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_content: {
        Row: {
          captured_at: string | null
          competitor_id: string
          content: string | null
          headline: string | null
          id: string
          platform: string
          primary_text: string | null
          screenshot: string | null
          url: string | null
        }
        Insert: {
          captured_at?: string | null
          competitor_id: string
          content?: string | null
          headline?: string | null
          id?: string
          platform: string
          primary_text?: string | null
          screenshot?: string | null
          url?: string | null
        }
        Update: {
          captured_at?: string | null
          competitor_id?: string
          content?: string | null
          headline?: string | null
          id?: string
          platform?: string
          primary_text?: string | null
          screenshot?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_content_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      cmo_ytvideos: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      competitor_content_marketing: {
        Row: {
          competitor_id: string
          created_at: string | null
          data: Json
          id: string
          updated_at: string | null
        }
        Insert: {
          competitor_id: string
          created_at?: string | null
          data: Json
          id?: string
          updated_at?: string | null
        }
        Update: {
          competitor_id?: string
          created_at?: string | null
          data?: Json
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_content_marketing_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_details: {
        Row: {
          competitor_id: string
          detail_type: string
          detail_value: string
          id: string
        }
        Insert: {
          competitor_id: string
          detail_type: string
          detail_value: string
          id?: string
        }
        Update: {
          competitor_id?: string
          detail_type?: string
          detail_value?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_details_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_profile_relations: {
        Row: {
          competitor_id: string
          profile_id: string
        }
        Insert: {
          competitor_id: string
          profile_id: string
        }
        Update: {
          competitor_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_profile_relations_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_profile_relations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          ads_collected: boolean | null
          ads_collection_error: string | null
          ads_collection_status: string | null
          id: string
          marketing_strategy: string | null
          name: string
          project_id: string
          url: string
          voice_tone: string | null
          youtube_analyzed_at: string | null
          youtube_channel_id: string | null
          youtube_strategy: string | null
        }
        Insert: {
          ads_collected?: boolean | null
          ads_collection_error?: string | null
          ads_collection_status?: string | null
          id?: string
          marketing_strategy?: string | null
          name: string
          project_id: string
          url: string
          voice_tone?: string | null
          youtube_analyzed_at?: string | null
          youtube_channel_id?: string | null
          youtube_strategy?: string | null
        }
        Update: {
          ads_collected?: boolean | null
          ads_collection_error?: string | null
          ads_collection_status?: string | null
          id?: string
          marketing_strategy?: string | null
          name?: string
          project_id?: string
          url?: string
          voice_tone?: string | null
          youtube_analyzed_at?: string | null
          youtube_channel_id?: string | null
          youtube_strategy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          demographics: string | null
          description: string | null
          goals: string | null
          id: string
          pain_points: string | null
          profile_name: string
          project_id: string
        }
        Insert: {
          demographics?: string | null
          description?: string | null
          goals?: string | null
          id?: string
          pain_points?: string | null
          profile_name: string
          project_id: string
        }
        Update: {
          demographics?: string | null
          description?: string | null
          goals?: string | null
          id?: string
          pain_points?: string | null
          profile_name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      project_analyses: {
        Row: {
          created_at: string
          id: string
          project_id: string
          raw_ai_response: string | null
          raw_website_content: string | null
          summary: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          raw_ai_response?: string | null
          raw_website_content?: string | null
          summary?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          raw_ai_response?: string | null
          raw_website_content?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          last_updated: string | null
          name: string
          owner_id: string | null
          screenshot: string | null
          status: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string | null
          name: string
          owner_id?: string | null
          screenshot?: string | null
          status: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          owner_id?: string | null
          screenshot?: string | null
          status?: string
          url?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: { sql_query: string }
        Returns: Json
      }
      fetch_marketing_gaps: {
        Args: { p_project_id: string }
        Returns: Json[]
      }
      get_fallback_gemini_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      table_exists: {
        Args: { p_table_name: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user" | "visitor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user", "visitor"],
    },
  },
} as const
