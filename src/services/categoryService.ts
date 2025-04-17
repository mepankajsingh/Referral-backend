import { supabase } from '@/lib/supabase';
import { Category, CategoryInsert, CategoryUpdate } from '@/lib/database.types';

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data || [];
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching category by slug:', error);
    throw error;
  }

  return data;
};

export const createCategory = async (category: CategoryInsert): Promise<Category> => {
  const now = new Date().toISOString();
  const newCategory = {
    ...category,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from('categories')
    .insert(newCategory)
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
};

export const updateCategory = async (id: number, category: CategoryUpdate): Promise<Category> => {
  const updates = {
    ...category,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
