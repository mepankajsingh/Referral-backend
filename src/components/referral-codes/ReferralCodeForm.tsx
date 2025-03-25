import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { 
  getReferralCodeById, 
  createReferralCode, 
  updateReferralCode, 
  getCategories 
} from '../../lib/supabase';
import { Category } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import toast from 'react-hot-toast';

const referralCodeSchema = z.object({
  app_name: z.string().min(1, 'App name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional().nullable(),
  url: z.string().url('Must be a valid URL'),
  category_id: z.string().min(1, 'Category is required'),
  user_benefit: z.string().optional().nullable(),
  referrer_benefit: z.string().optional().nullable(),
  icon: z.string().url('Must be a valid URL').optional().nullable(),
  slug: z.string().min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  meta_title: z.string().optional().nullable(),
  screenshots: z.string().optional().nullable(),
});

type FormData = z.infer<typeof referralCodeSchema>;

const ReferralCodeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(referralCodeSchema),
    defaultValues: {
      app_name: '',
      code: '',
      description: '',
      url: '',
      category_id: '',
      user_benefit: '',
      referrer_benefit: '',
      icon: '',
      slug: '',
      meta_title: '',
      screenshots: '',
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (isEditing && id) {
        try {
          const data = await getReferralCodeById(parseInt(id));
          
          // Set form values
          setValue('app_name', data.app_name);
          setValue('code', data.code);
          setValue('description', data.description || '');
          setValue('url', data.url);
          setValue('category_id', data.category_id.toString());
          setValue('user_benefit', data.user_benefit || '');
          setValue('referrer_benefit', data.referrer_benefit || '');
          setValue('icon', data.icon || '');
          setValue('slug', data.slug);
          setValue('meta_title', data.meta_title || '');
          
          // Format screenshots as one URL per line
          if (data.screenshots && Array.isArray(data.screenshots)) {
            // Handle both formats: array of objects with url property or array of strings
            const screenshotUrls = data.screenshots.map(s => {
              if (typeof s === 'string') {
                try {
                  // Try to parse if it's a JSON string
                  const parsed = JSON.parse(s);
                  return parsed.url || s;
                } catch {
                  // If parsing fails, it's already a string URL
                  return s;
                }
              } else if (s && typeof s === 'object' && 'url' in s) {
                return s.url;
              }
              return '';
            }).filter(Boolean).join('\n');
            
            setValue('screenshots', screenshotUrls);
          } else {
            setValue('screenshots', '');
          }
        } catch (error) {
          console.error('Error fetching referral code:', error);
          toast.error('Failed to load referral code');
          navigate('/referral-codes');
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
      }
    };

    fetchReferralCode();
  }, [id, isEditing, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      // Parse screenshots from line-by-line format to array of strings
      let screenshotsData = null;
      if (data.screenshots) {
        const lines = data.screenshots.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 0) {
          // Store as simple array of strings instead of objects with url property
          screenshotsData = lines.map(url => {
            const trimmedUrl = url.trim();
            // Validate URL format
            if (!trimmedUrl.match(/^https?:\/\/.+/i)) {
              throw new Error(`Invalid URL format: ${trimmedUrl}`);
            }
            return trimmedUrl; // Store as simple string, not as object
          });
        }
      }

      const formattedData = {
        ...data,
        category_id: parseInt(data.category_id),
        screenshots: screenshotsData
      };

      if (isEditing && id) {
        await updateReferralCode(parseInt(id), formattedData);
        toast.success('Referral code updated successfully');
      } else {
        await createReferralCode(formattedData);
        toast.success('Referral code created successfully');
      }
      
      navigate('/referral-codes');
    } catch (error) {
      console.error('Error saving referral code:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(isEditing ? 'Failed to update referral code' : 'Failed to create referral code');
      }
    } finally {
      setLoading(false);
    }
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
          onClick={() => navigate('/referral-codes')}
          className="mr-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Referral Code' : 'Add New Referral Code'}
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="App Name"
              {...register('app_name')}
              error={errors.app_name?.message}
            />
            
            <Input
              label="Code"
              {...register('code')}
              error={errors.code?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="URL"
              {...register('url')}
              error={errors.url?.message}
            />
            
            <Select
              label="Category"
              {...register('category_id')}
              error={errors.category_id?.message}
              options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Slug"
              {...register('slug')}
              error={errors.slug?.message}
            />
            
            <Input
              label="Icon URL"
              {...register('icon')}
              error={errors.icon?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="User Benefit"
              {...register('user_benefit')}
              error={errors.user_benefit?.message}
            />
            
            <Input
              label="Referrer Benefit"
              {...register('referrer_benefit')}
              error={errors.referrer_benefit?.message}
            />
          </div>

          <Input
            label="Meta Title"
            {...register('meta_title')}
            error={errors.meta_title?.message}
          />

          <TextArea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            rows={4}
          />

          <TextArea
            label="Screenshots (One URL per line)"
            {...register('screenshots')}
            error={errors.screenshots?.message}
            rows={4}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={loading}
            >
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update' : 'Create'} Referral Code
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralCodeForm;
