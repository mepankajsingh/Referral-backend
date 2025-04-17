import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getReferralCodeBySlug, createReferralCode, updateReferralCode } from '@/services/referralCodeService';
import { getCategories } from '@/services/categoryService';
import { ReferralCodeInsert, Category } from '@/lib/database.types';
import { Editor } from 'primereact/editor';
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget';

const ReferralCodeForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ReferralCodeInsert>({
    service_name: '',
    slug: '',
    code: '',
    description: '',
    terms: '',
    user_benefit: '',
    referrer_benefit: '',
    logo_url: '',
    screenshot_url: '',
    url: '',
    featured: false,
    category_id: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        if (categoriesData.length > 0 && !isEditMode) {
          setFormData(prev => ({
            ...prev,
            category_id: categoriesData[0].id
          }));
        }
        
        if (isEditMode && slug) {
          const referralCode = await getReferralCodeBySlug(slug);
          if (!referralCode) {
            setError('Referral code not found');
            return;
          }
          
          setFormData({
            service_name: referralCode.service_name,
            slug: referralCode.slug,
            code: referralCode.code,
            description: referralCode.description || '',
            terms: referralCode.terms || '',
            user_benefit: referralCode.user_benefit || '',
            referrer_benefit: referralCode.referrer_benefit || '',
            logo_url: referralCode.logo_url || '',
            screenshot_url: referralCode.screenshot_url || '',
            url: referralCode.url || '',
            featured: referralCode.featured,
            category_id: referralCode.category_id
          });
          
          if (referralCode.logo_url) {
            setLogoPreview(referralCode.logo_url);
          }
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = (content: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: content }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleServiceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      service_name: name,
      slug: generateSlug(name)
    }));
  };

  const handleLogoUploadSuccess = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
    setLogoPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode && slug) {
        const referralCode = await getReferralCodeBySlug(slug);
        if (referralCode) {
          await updateReferralCode(referralCode.id, formData);
        } else {
          throw new Error('Referral code not found');
        }
      } else {
        await createReferralCode(formData);
      }
      
      navigate('/referral-codes');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} referral code`);
      console.error(err);
      setSubmitting(false);
    }
  };

  // Common input class for consistent height
  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-800 h-10";

  // Custom editor styles to match other inputs
  const editorHeaderStyle = {
    fontSize: '0.875rem', // text-sm
  };

  if (loading) {
    return <p className="text-gray-500 text-center py-4">Loading...</p>;
  }

  return (
    <div className="w-full">
      <Link to="/referral-codes" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">
        &larr; Back to Referral Codes
      </Link>

      <h1 className="text-xl font-medium mb-4">
        {isEditMode ? 'Edit Referral Code' : 'New Referral Code'}
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="service_name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              id="service_name"
              name="service_name"
              value={formData.service_name}
              onChange={handleServiceNameChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Referral Code *
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="user_benefit" className="block text-sm font-medium text-gray-700 mb-1">
              User Benefit
            </label>
            <input
              type="text"
              id="user_benefit"
              name="user_benefit"
              value={formData.user_benefit || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="referrer_benefit" className="block text-sm font-medium text-gray-700 mb-1">
              Referrer Benefit
            </label>
            <input
              type="text"
              id="referrer_benefit"
              name="referrer_benefit"
              value={formData.referrer_benefit || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Editor
              value={formData.description || ''}
              onTextChange={(e) => handleEditorChange(e.htmlValue || '', 'description')}
              style={{ height: '200px' }}
              headerTemplate={
                <div style={editorHeaderStyle} className="p-editor-toolbar">
                  <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                  </span>
                  <span className="ql-formats">
                    <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                    <button className="ql-list" value="bullet" aria-label="Unordered List"></button>
                  </span>
                  <span className="ql-formats">
                    <button className="ql-link" aria-label="Insert Link"></button>
                  </span>
                </div>
              }
            />
          </div>

          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
              Terms
            </label>
            <textarea
              id="terms"
              name="terms"
              value={formData.terms || ''}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-800"
              style={{ height: '200px', resize: 'none' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  id="logo_url"
                  name="logo_url"
                  value={formData.logo_url || ''}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter logo URL or upload"
                />
                <CloudinaryUploadWidget 
                  onUploadSuccess={handleLogoUploadSuccess}
                  buttonText="Upload"
                />
              </div>
              {logoPreview && (
                <div className="mt-2 relative">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="h-16 w-16 object-contain border border-gray-200 rounded p-1 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null);
                      setFormData(prev => ({ ...prev, logo_url: '' }));
                    }}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 text-gray-500 hover:text-gray-700 border border-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="screenshot_url" className="block text-sm font-medium text-gray-700 mb-1">
              Screenshot URL
            </label>
            <input
              type="url"
              id="screenshot_url"
              name="screenshot_url"
              value={formData.screenshot_url || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Referral URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
            Featured Referral Code
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <Link
            to="/referral-codes"
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded mr-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReferralCodeForm;
