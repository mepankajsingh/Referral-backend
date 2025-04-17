export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      referral_codes: {
        Row: {
          id: number;
          service_name: string;
          logo_url: string | null;
          code: string;
          description: string | null;
          terms: string | null;
          user_benefit: string | null;
          referrer_benefit: string | null;
          screenshot_url: string | null;
          url: string | null;
          featured: boolean;
          category_id: number;
          created_at: string;
          updated_at: string;
          slug: string;
          categories?: {
            name: string;
          };
        };
        Insert: {
          id?: number;
          service_name: string;
          logo_url?: string | null;
          code: string;
          description?: string | null;
          terms?: string | null;
          user_benefit?: string | null;
          referrer_benefit?: string | null;
          screenshot_url?: string | null;
          url?: string | null;
          featured?: boolean;
          category_id: number;
          created_at?: string;
          updated_at?: string;
          slug: string;
        };
        Update: {
          id?: number;
          service_name?: string;
          logo_url?: string | null;
          code?: string;
          description?: string | null;
          terms?: string | null;
          user_benefit?: string | null;
          referrer_benefit?: string | null;
          screenshot_url?: string | null;
          url?: string | null;
          featured?: boolean;
          category_id?: number;
          created_at?: string;
          updated_at?: string;
          slug?: string;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type ReferralCode = Database['public']['Tables']['referral_codes']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type ReferralCodeInsert = Database['public']['Tables']['referral_codes']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];
export type ReferralCodeUpdate = Database['public']['Tables']['referral_codes']['Update'];
