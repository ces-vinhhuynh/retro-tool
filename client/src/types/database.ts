export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      action_item_assignees: {
        Row: {
          action_item_id: string | null;
          created_at: string | null;
          id: string;
          team_user_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          action_item_id?: string | null;
          created_at?: string | null;
          id?: string;
          team_user_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          action_item_id?: string | null;
          created_at?: string | null;
          id?: string;
          team_user_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'action_item_assignees_action_item_id_fkey';
            columns: ['action_item_id'];
            isOneToOne: false;
            referencedRelation: 'action_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'action_item_assignees_team_user_id_fkey';
            columns: ['team_user_id'];
            isOneToOne: false;
            referencedRelation: 'team_users';
            referencedColumns: ['id'];
          },
        ];
      };
      action_items: {
        Row: {
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          event_id: string | null;
          health_check_id: string | null;
          id: string;
          priority: Database['public']['Enums']['action_item_priority'] | null;
          question_id: string | null;
          status: Database['public']['Enums']['action_item_status'] | null;
          team_id: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          event_id?: string | null;
          health_check_id?: string | null;
          id?: string;
          priority?: Database['public']['Enums']['action_item_priority'] | null;
          question_id?: string | null;
          status?: Database['public']['Enums']['action_item_status'] | null;
          team_id?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          event_id?: string | null;
          health_check_id?: string | null;
          id?: string;
          priority?: Database['public']['Enums']['action_item_priority'] | null;
          question_id?: string | null;
          status?: Database['public']['Enums']['action_item_status'] | null;
          team_id?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'action_items_health_check_id_fkey';
            columns: ['health_check_id'];
            isOneToOne: false;
            referencedRelation: 'health_checks';
            referencedColumns: ['id'];
          },
        ];
      };
      agreements: {
        Row: {
          created_at: string | null;
          description: string | null;
          health_check_id: string | null;
          id: string;
          team_id: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          health_check_id?: string | null;
          id?: string;
          team_id?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          health_check_id?: string | null;
          id?: string;
          team_id?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'agreements_health_check_id_fkey';
            columns: ['health_check_id'];
            isOneToOne: false;
            referencedRelation: 'health_checks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'agreements_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };
      health_check_templates: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          is_custom: boolean | null;
          max_value: Json;
          min_value: Json;
          name: string;
          original_id: string | null;
          questions: Json;
          team_id: string | null;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_custom?: boolean | null;
          max_value: Json;
          min_value: Json;
          name: string;
          original_id?: string | null;
          questions: Json;
          team_id?: string | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_custom?: boolean | null;
          max_value?: Json;
          min_value?: Json;
          name?: string;
          original_id?: string | null;
          questions?: Json;
          team_id?: string | null;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      health_checks: {
        Row: {
          average_score: Json | null;
          created_at: string | null;
          current_group_index: number | null;
          current_question_index: number | null;
          current_step: number | null;
          description: string | null;
          end_time: string | null;
          facilitator_ids: string[] | null;
          id: string;
          invited_user_ids: Json | null;
          participants: Json | null;
          settings: Json | null;
          status: Database['public']['Enums']['health_check_status'] | null;
          team_id: string | null;
          template_id: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          average_score?: Json | null;
          created_at?: string | null;
          current_group_index?: number | null;
          current_question_index?: number | null;
          current_step?: number | null;
          description?: string | null;
          end_time?: string | null;
          facilitator_ids?: string[] | null;
          id?: string;
          invited_user_ids?: Json | null;
          participants?: Json | null;
          settings?: Json | null;
          status?: Database['public']['Enums']['health_check_status'] | null;
          team_id?: string | null;
          template_id?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          average_score?: Json | null;
          created_at?: string | null;
          current_group_index?: number | null;
          current_question_index?: number | null;
          current_step?: number | null;
          description?: string | null;
          end_time?: string | null;
          facilitator_ids?: string[] | null;
          id?: string;
          invited_user_ids?: Json | null;
          participants?: Json | null;
          settings?: Json | null;
          status?: Database['public']['Enums']['health_check_status'] | null;
          team_id?: string | null;
          template_id?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'health_checks_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'health_checks_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'health_check_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      issues: {
        Row: {
          created_at: string | null;
          description: string | null;
          health_check_id: string | null;
          id: string;
          team_id: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          health_check_id?: string | null;
          id?: string;
          team_id?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          health_check_id?: string | null;
          id?: string;
          team_id?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'issues_health_check_id_fkey';
            columns: ['health_check_id'];
            isOneToOne: false;
            referencedRelation: 'health_checks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'issues_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };
      participants: {
        Row: {
          created_at: string | null;
          health_check_id: string;
          last_active: string | null;
          progress: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          health_check_id: string;
          last_active?: string | null;
          progress?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          health_check_id?: string;
          last_active?: string | null;
          progress?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'participants_health_check_id_fkey';
            columns: ['health_check_id'];
            isOneToOne: false;
            referencedRelation: 'health_checks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      responses: {
        Row: {
          answers: Json | null;
          created_at: string | null;
          health_check_id: string;
          health_check_rating: number | null;
          id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          answers?: Json | null;
          created_at?: string | null;
          health_check_id: string;
          health_check_rating?: number | null;
          id?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          answers?: Json | null;
          created_at?: string | null;
          health_check_id?: string;
          health_check_rating?: number | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'responses_health_check_id_fkey';
            columns: ['health_check_id'];
            isOneToOne: false;
            referencedRelation: 'health_checks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'responses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      team_users: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          role: Database['public']['Enums']['team_role'] | null;
          status: Database['public']['Enums']['team_user_status'] | null;
          team_id: string;
          token: string | null;
          token_expires_at: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          role?: Database['public']['Enums']['team_role'] | null;
          status?: Database['public']['Enums']['team_user_status'] | null;
          team_id: string;
          token?: string | null;
          token_expires_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          role?: Database['public']['Enums']['team_role'] | null;
          status?: Database['public']['Enums']['team_user_status'] | null;
          team_id?: string;
          token?: string | null;
          token_expires_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'team_users_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'team_users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          updated_at: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          updated_at?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          updated_at?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teams_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspaces';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      workspace_users: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          role: Database['public']['Enums']['workspace_role'] | null;
          status: Database['public']['Enums']['project_user_status'] | null;
          token: string | null;
          token_expires_at: string | null;
          updated_at: string | null;
          user_id: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          role?: Database['public']['Enums']['workspace_role'] | null;
          status?: Database['public']['Enums']['project_user_status'] | null;
          token?: string | null;
          token_expires_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          role?: Database['public']['Enums']['workspace_role'] | null;
          status?: Database['public']['Enums']['project_user_status'] | null;
          token?: string | null;
          token_expires_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workspace_users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_users_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspaces';
            referencedColumns: ['id'];
          },
        ];
      };
      workspaces: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_workspace_and_team: {
        Args: {
          ws_id: string;
          ws_name: string;
          team_id: string;
          team_name: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      action_item_priority: 'high' | 'medium' | 'low';
      action_item_status: 'todo' | 'in_progress' | 'done' | 'blocked';
      health_check_status: 'in progress' | 'done';
      project_user_status: 'pending' | 'accepted' | 'expired';
      team_role: 'admin' | 'member';
      team_user_status: 'pending' | 'accepted' | 'expired';
      workspace_role: 'owner' | 'admin' | 'member';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      action_item_priority: ['high', 'medium', 'low'],
      action_item_status: ['todo', 'in_progress', 'done', 'blocked'],
      health_check_status: ['in progress', 'done'],
      project_user_status: ['pending', 'accepted', 'expired'],
      team_role: ['admin', 'member'],
      team_user_status: ['pending', 'accepted', 'expired'],
      workspace_role: ['owner', 'admin', 'member'],
    },
  },
} as const;
