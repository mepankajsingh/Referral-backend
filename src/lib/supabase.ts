import { createClient } from '@supabase/supabase-js';
import { ReferralCode, Category, User } from '../types';

const supabaseUrl = 'https://degisrkwerbjaoeibdiu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZ2lzcmt3ZXJiamFvZWliZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NjY3MjYsImV4cCI6MjA1ODM0MjcyNn0.6UuWf-__DJ9n6Ld1z0uan57IWyyR6sQ4ETn2WHU-mzk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Referral Codes API
export const getReferralCodes = async () => {
  const { data, error } = await supabase
    .from('referral_codes')
    .select('*');
  
  if (error) throw error;
  return data as ReferralCode[];
};

export const getReferralCodeById = async (id: number) => {
  const { data, error } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as ReferralCode;
};

export const createReferralCode = async (referralCode: Omit<ReferralCode, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('referral_codes')
    .insert(referralCode)
    .select()
    .single();
  
  if (error) throw error;
  return data as ReferralCode;
};

export const updateReferralCode = async (id: number, referralCode: Partial<ReferralCode>) => {
  const { data, error } = await supabase
    .from('referral_codes')
    .update(referralCode)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as ReferralCode;
};

export const deleteReferralCode = async (id: number) => {
  const { error } = await supabase
    .from('referral_codes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Categories API
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  return data as Category[];
};

export const getCategoryById = async (id: number) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Category;
};

export const createCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  
  if (error) throw error;
  return data as Category;
};

export const updateCategory = async (id: number, category: Partial<Category>) => {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Category;
};

export const deleteCategory = async (id: number) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Authentication
export const signInWithGoogle = async (token: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user;
};

// User role management
export const getUserRole = async (): Promise<'admin' | 'user'> => {
  const { data, error } = await supabase
    .rpc('get_current_user_role');
  
  if (error) {
    console.error('Error getting user role:', error);
    return 'user'; // Default to user if there's an error
  }
  
  return (data as 'admin' | 'user') || 'user';
};

export const isUserAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin';
};
