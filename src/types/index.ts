export interface ReferralCode {
  id: number;
  app_name: string;
  code: string;
  description: string | null;
  url: string;
  category_id: number;
  user_benefit: string | null;
  referrer_benefit: string | null;
  created_at: string;
  icon: string | null;
  slug: string;
  meta_title: string | null;
  screenshots: any | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  avatar_url?: string;
  name?: string;
  role?: 'admin' | 'user';
}
