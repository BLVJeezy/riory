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
      appointments: {
        Row: {
          akkoord_voorwaarden: boolean
          beschrijving: string | null
          created_at: string
          dienst: string
          fact_bedrijfsnaam: string | null
          fact_btw_nummer: string | null
          fact_email: string
          fact_facturatie_email: string | null
          fact_huisnummer: string | null
          fact_kbo_nummer: string | null
          fact_naam: string | null
          fact_plaats: string | null
          fact_postcode: string | null
          fact_straat: string | null
          fact_telefoon: string | null
          fact_voornaam: string | null
          gevonden_detail: string | null
          gevonden_via: string | null
          id: string
          klant_type: string
          syndicus_email: string | null
          syndicus_facturatie_email: string | null
          syndicus_huisnummer: string | null
          syndicus_kantoor: string | null
          syndicus_kbo_nummer: string | null
          syndicus_naam: string | null
          syndicus_naam_vme: string | null
          syndicus_plaats: string | null
          syndicus_postcode: string | null
          syndicus_straat: string | null
          syndicus_telefoon: string | null
          syndicus_voornaam: string | null
          urgent: boolean
          werf_contactpersoon: string | null
          werf_huisnummer: string | null
          werf_plaats: string | null
          werf_postcode: string | null
          werf_projectnaam: string | null
          werf_straat: string | null
          werf_telefoon: string | null
          werfadres_is_facturatieadres: boolean | null
          woning_ouder_dan_10_jaar: boolean | null
        }
        Insert: {
          akkoord_voorwaarden?: boolean
          beschrijving?: string | null
          created_at?: string
          dienst: string
          fact_bedrijfsnaam?: string | null
          fact_btw_nummer?: string | null
          fact_email: string
          fact_facturatie_email?: string | null
          fact_huisnummer?: string | null
          fact_kbo_nummer?: string | null
          fact_naam?: string | null
          fact_plaats?: string | null
          fact_postcode?: string | null
          fact_straat?: string | null
          fact_telefoon?: string | null
          fact_voornaam?: string | null
          gevonden_detail?: string | null
          gevonden_via?: string | null
          id?: string
          klant_type: string
          syndicus_email?: string | null
          syndicus_facturatie_email?: string | null
          syndicus_huisnummer?: string | null
          syndicus_kantoor?: string | null
          syndicus_kbo_nummer?: string | null
          syndicus_naam?: string | null
          syndicus_naam_vme?: string | null
          syndicus_plaats?: string | null
          syndicus_postcode?: string | null
          syndicus_straat?: string | null
          syndicus_telefoon?: string | null
          syndicus_voornaam?: string | null
          urgent?: boolean
          werf_contactpersoon?: string | null
          werf_huisnummer?: string | null
          werf_plaats?: string | null
          werf_postcode?: string | null
          werf_projectnaam?: string | null
          werf_straat?: string | null
          werf_telefoon?: string | null
          werfadres_is_facturatieadres?: boolean | null
          woning_ouder_dan_10_jaar?: boolean | null
        }
        Update: {
          akkoord_voorwaarden?: boolean
          beschrijving?: string | null
          created_at?: string
          dienst?: string
          fact_bedrijfsnaam?: string | null
          fact_btw_nummer?: string | null
          fact_email?: string
          fact_facturatie_email?: string | null
          fact_huisnummer?: string | null
          fact_kbo_nummer?: string | null
          fact_naam?: string | null
          fact_plaats?: string | null
          fact_postcode?: string | null
          fact_straat?: string | null
          fact_telefoon?: string | null
          fact_voornaam?: string | null
          gevonden_detail?: string | null
          gevonden_via?: string | null
          id?: string
          klant_type?: string
          syndicus_email?: string | null
          syndicus_facturatie_email?: string | null
          syndicus_huisnummer?: string | null
          syndicus_kantoor?: string | null
          syndicus_kbo_nummer?: string | null
          syndicus_naam?: string | null
          syndicus_naam_vme?: string | null
          syndicus_plaats?: string | null
          syndicus_postcode?: string | null
          syndicus_straat?: string | null
          syndicus_telefoon?: string | null
          syndicus_voornaam?: string | null
          urgent?: boolean
          werf_contactpersoon?: string | null
          werf_huisnummer?: string | null
          werf_plaats?: string | null
          werf_postcode?: string | null
          werf_projectnaam?: string | null
          werf_straat?: string | null
          werf_telefoon?: string | null
          werfadres_is_facturatieadres?: boolean | null
          woning_ouder_dan_10_jaar?: boolean | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      google_reviews: {
        Row: {
          created_at: string
          google_review_id: string | null
          id: string
          rating: number
          review_date: string | null
          review_text: string
          reviewer_name: string
          source: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          google_review_id?: string | null
          id?: string
          rating?: number
          review_date?: string | null
          review_text: string
          reviewer_name: string
          source?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          google_review_id?: string | null
          id?: string
          rating?: number
          review_date?: string | null
          review_text?: string
          reviewer_name?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page: string
          referrer: string | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          audio_url: string | null
          beschrijving: string | null
          created_at: string
          dienst: string | null
          email: string
          id: string
          locatie: string | null
          naam: string
          photo_urls: string[] | null
          schatting_grondtype: string | null
          schatting_lengte: string | null
          schatting_locatie: string | null
          schatting_max: number | null
          schatting_min: number | null
          schatting_project_type: string | null
          telefoon: string | null
        }
        Insert: {
          audio_url?: string | null
          beschrijving?: string | null
          created_at?: string
          dienst?: string | null
          email: string
          id?: string
          locatie?: string | null
          naam: string
          photo_urls?: string[] | null
          schatting_grondtype?: string | null
          schatting_lengte?: string | null
          schatting_locatie?: string | null
          schatting_max?: number | null
          schatting_min?: number | null
          schatting_project_type?: string | null
          telefoon?: string | null
        }
        Update: {
          audio_url?: string | null
          beschrijving?: string | null
          created_at?: string
          dienst?: string | null
          email?: string
          id?: string
          locatie?: string | null
          naam?: string
          photo_urls?: string[] | null
          schatting_grondtype?: string | null
          schatting_lengte?: string | null
          schatting_locatie?: string | null
          schatting_max?: number | null
          schatting_min?: number | null
          schatting_project_type?: string | null
          telefoon?: string | null
        }
        Relationships: []
      }
      simpla_health_checks: {
        Row: {
          checked_at: string
          error_message: string | null
          http_status: number | null
          id: string
          latency_ms: number | null
          status: string
        }
        Insert: {
          checked_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          latency_ms?: number | null
          status: string
        }
        Update: {
          checked_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          latency_ms?: number | null
          status?: string
        }
        Relationships: []
      }
      simpla_health_incidents: {
        Row: {
          alert_count: number
          consecutive_failures: number
          id: string
          last_alert_at: string | null
          last_error_message: string | null
          last_http_status: number | null
          opened_at: string
          resolved_at: string | null
          status: string
        }
        Insert: {
          alert_count?: number
          consecutive_failures?: number
          id?: string
          last_alert_at?: string | null
          last_error_message?: string | null
          last_http_status?: number | null
          opened_at?: string
          resolved_at?: string | null
          status?: string
        }
        Update: {
          alert_count?: number
          consecutive_failures?: number
          id?: string
          last_alert_at?: string | null
          last_error_message?: string | null
          last_http_status?: number | null
          opened_at?: string
          resolved_at?: string | null
          status?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
