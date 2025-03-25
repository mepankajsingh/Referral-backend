import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { getCategoryById, createCategory, updateCategory } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import toast from 'react-hot-toast';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional().nullable(),
});

type FormData = z.infer<typeof categorySchema>;

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    }
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditing && id) {
        try {
          const data = await getCategoryById(parseInt(id));
          
          // Set form values
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('description', data.description || '');
        } catch (error) {
          console.error('Error fetching category:', error);
          toast.error('Failed to load category');
          navigate('/categories');
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEditing, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      if (isEditing && id) {
        await updateCategory(parseInt(id), data);
        toast.success('Category updated successfully');
      } else {
        await createCategory(data);
        toast.success('Category created successfully');
      }
      
      navigate('/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(isEditing ? 'Failed to update category' : 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    setValue('slug', slug);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/categories')}
          className="mr-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Name"
            {...register('name')}
            onChange={handleNameChange}
            error={errors.name?.message}
          />
          
          <Input
            label="Slug"
            {...register('slug')}
            error={errors.slug?.message}
          />
          
          <TextArea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            rows={4}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
            >
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
