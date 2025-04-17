import { supabase } from '@/lib/supabase';
import { ReferralCode, ReferralCodeInsert, ReferralCodeUpdate } from '@/lib/database.types';

export const getReferralCodes = async (): Promise<ReferralCode[]> => {
  const { data, error } = await supabase
    .from('referral_codes')
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .order('service_name');

  if (error) {
    console.error('Error fetching referral codes:', error);
    throw error;
  }

  return data || [];
};

export const getReferralCodesByCategory = async (categoryId: number): Promise<ReferralCode[]> => {
  const { data, error } = await supabase
    .from('referral_codes')
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .eq('category_id', categoryId)
    .order('service_name');

  if (error) {
    console.error('Error fetching referral codes by category:', error);
    throw error;
  }

  return data || [];
};

export const getReferralCodeBySlug = async (slug: string): Promise<ReferralCode | null> => {
  const { data, error } = await supabase
    .from('referral_codes')
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching referral code by slug:', error);
    throw error;
  }

  return data;
};

export const getFeaturedReferralCodes = async (): Promise<ReferralCode[]> => {
  const { data, error } = await supabase
    .from('referral_codes')
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .eq('featured', true)
    .order('service_name');

  if (error) {
    console.error('Error fetching featured referral codes:', error);
    throw error;
  }

  return data || [];
};

export const createReferralCode = async (referralCode: ReferralCodeInsert): Promise<ReferralCode> => {
  const now = new Date().toISOString();
  const newReferralCode = {
    ...referralCode,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from('referral_codes')
    .insert(newReferralCode)
    .select()
    .single();

  if (error) {
    console.error('Error creating referral code:', error);
    throw error;
  }

  return data;
};

export const updateReferralCode = async (id: number, referralCode: ReferralCodeUpdate): Promise<ReferralCode> => {
  const updates = {
    ...referralCode,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('referral_codes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating referral code:', error);
    throw error;
  }

  return data;
};

export const deleteReferralCode = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('referral_codes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting referral code:', error);
    throw error;
  }
};
